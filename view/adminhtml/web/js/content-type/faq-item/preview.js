define([
    'jquery',
    'underscore',
    'knockout',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/content-type/preview',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/wysiwyg/factory'
], function ($, _, ko, $t, events, PreviewBase, config, wysiwygFactory) {
    'use strict';

    /**
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewBase.call(this, parent, config, stageId);
    }

    Preview.prototype = Object.create(PreviewBase.prototype);

    /**
     * @returns {boolean}
     */
    Preview.prototype.isWysiwygSupported = function isWysiwygSupported() {
        return config.getConfig("can_use_inline_editing_on_stage");
    };

    /**
     * @param {HTMLElement} element
     */
    Preview.prototype.initWysiwyg = function (element) {
        var self = this;
        this.element = element;
        element.id = this.contentType.id + "-editor-answer";
        wysiwygFactory(
            this.contentType.id,
            element.id,
            this.config.name,
            this.config.additional_data.wysiwygConfig.wysiwygConfigData,
            this.contentType.dataStore, "answer"
        ).then(function (wysiwyg) {
            self.wysiwyg = wysiwyg;
        });
    };

    /**
     * Question editor
     *
     * @param {HTMLElement} element
     */
    Preview.prototype.initWysiwygQuestion = function (element) {
        var self = this;
        this.element = element;
        element.id = this.contentType.id + "-editor-question";
        wysiwygFactory(
            this.contentType.id,
            element.id,
            this.config.name,
            this.config.additional_data.wysiwygConfig.wysiwygConfigData,
            this.contentType.dataStore, "question"
        ).then(function (wysiwyg) {
            self.wysiwyg = wysiwyg;
        });
    };

    /**
     * @param {HTMLTextAreaElement} element
     */
    Preview.prototype.initTextarea = function (element) {
        var self = this;

        this.textarea = element;

        this.textarea.value = this.contentType.dataStore.get("answer");
        this.adjustTextareaHeightBasedOnScrollHeight();

        events.on("form:" + this.contentType.id + ":saveAfter", function () {
            self.textarea.value = self.contentType.dataStore.get("answer");

            self.adjustTextareaHeightBasedOnScrollHeight();
        });
    };

    /**
     * Question Text area
     * @param {HTMLTextAreaElement} element
     */
    Preview.prototype.initTextareaQuestion = function (element) {
        var self = this;
        this.textarea = element;
        this.textarea.value = this.contentType.dataStore.get("question");
        this.adjustTextareaHeightBasedOnScrollHeight();
        events.on("form:" + this.contentType.id + ":saveAfter", function () {
           self.textarea.value = self.contentType.dataStore.get("question");
           self.adjustTextareaHeightBasedOnScrollHeight();
        });
    };
    
    /**
     * Save current value of textarea in data store for answer
     */
    Preview.prototype.onTextareaKeyUp = function () {
        this.adjustTextareaHeightBasedOnScrollHeight();
        this.contentType.dataStore.update(this.textarea.value, "answer");
    };

    /**
     * Save current value of textarea in data store for Question
     */
    Preview.prototype.onTextareaKeyUpQuestion = function () {
        this.adjustTextareaHeightBasedOnScrollHeight();
        this.contentType.dataStore.update(this.textarea.value, "question");
    };

    /**
     * Start stage interaction on textarea blur
     */
    Preview.prototype.onTextareaFocus = function () {
        $(this.textarea).closest(".pagebuilder-content-type").addClass("pagebuilder-toolbar-active");

        events.trigger("stage:interactionStart");
    };

    /**
     * Stop stage interaction on textarea blur
     */
    Preview.prototype.onTextareaBlur = function () {
        $(this.textarea).closest(".pagebuilder-content-type").removeClass("pagebuilder-toolbar-active");

        events.trigger("stage:interactionStop");
    };

    /**
     * Adjust textarea height based on scrollHeight
     */
    Preview.prototype.adjustTextareaHeightBasedOnScrollHeight = function () {
        this.textarea.style.height = "";
        var scrollHeight = this.textarea.scrollHeight;
        var minHeight = parseInt($(this.textarea).css("min-height").toString(), 10);

        if (scrollHeight === minHeight) {
            // Leave height at 'auto'
            return;
        }

        $(this.textarea).height(scrollHeight);
    };

    /**
     * Check if content type is container
     *
     * @returns {boolean}
     */
    Preview.prototype.isContainer = function () {
        return false;
    };

    return Preview;
});
