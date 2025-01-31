define([
    'jquery',
    'underscore',
    'knockout',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/content-type/preview-collection',
    'Magento_PageBuilder/js/content-type-factory',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/content-type-menu/option',
    'mage/accordion',
    'Magento_PageBuilder/js/wysiwyg/factory',
], function ($, _, ko, $t, events, PreviewCollection, createContentType, config, option, wysiwygFactory) {
    'use strict';

    /**
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewCollection.call(this, parent, config, stageId);
    }

    Preview.prototype = Object.create(PreviewCollection.prototype);

    /**
     * Root element
     */
    Preview.prototype.element = null;

    Preview.prototype.initializeAccordionWidget = _.debounce(function () {
        if (this.element) {
            try {
                $(this.element).accordion('destroy');
            } catch (e) {
            }
            $(this.element).accordion();
        }
    }, 10);

    /**
     * Bind events to add empty FAQ item when FAQ added and reinitialize accordion when FAQ item added
     */
    Preview.prototype.bindEvents = function bindEvents() {
        var self = this;

        PreviewCollection.prototype.bindEvents.call(this);

        events.on("faq:dropAfter", function (args) {
            if (args.id === self.contentType.id && self.contentType.children().length === 0) {
                self.addDividerAndText();
            }
        });

        events.on("faq-item:renderAfter", (args) => {
            if (args.contentType.parentContentType.id === self.contentType.id) {
                this.initializeAccordionWidget();
            }
        });
    };

    /**
     * Add FAQ item
     */
    Preview.prototype.addFaqItem = function () {
        const faqItemCount = this.contentType.children().reduce((count, tab) => {
            return tab.dataStore.getState().name === 'faq-item' ? count + 1 : count;
        }, 0);
        createContentType(
            config.getContentTypeConfig("faq-item"),
            this.contentType,
            this.contentType.stageId,
            {
                question: $t("Question ") + (faqItemCount + 1),
                answer: $t("Answer ") + (faqItemCount + 1)
            }
        ).then(container => {
            this.contentType.addChild(container);
        })
    };

    /**
     * Add Divider and Text
     */
    Preview.prototype.addDividerAndText = function () {
        var self = this;
        // Adding a Divider
        createContentType(
            config.getContentTypeConfig("text"),
            this.contentType,
            this.contentType.stageId
        ).then(function (titleContainer) {
            self.contentType.addChild(titleContainer);
            // Adding a Divider
            createContentType(
                config.getContentTypeConfig("divider"),
                self.contentType,
                self.contentType.stageId
            ).then(function (dividerContainer) {
                self.contentType.addChild(dividerContainer);
                // Adding Text below the Divider
                createContentType(
                    config.getContentTypeConfig("text"),
                    self.contentType,
                    self.contentType.stageId
                ).then(function (textContainer) {
                    self.contentType.addChild(textContainer);
                    // Add Faq-Items after Intro(Divider and Text)
                    self.addFaqItem();
                });
            });
        });
    };

    /**
     * Return content menu options
     *
     * @returns {object}
     */
    Preview.prototype.retrieveOptions = function () {
        var self = this;
        var options = PreviewCollection.prototype.retrieveOptions.call(this);

        options.add = new option({
            preview: this,
            icon: "<i class='icon-pagebuilder-add'></i>",
            title: "Add",
            action: self.addFaqItem,
            classes: ["add-child"],
            sort: 10
        });
        return options;
    };

    /**
     * Set root element
     *
     * @returns {void}
     */
    Preview.prototype.afterRender = function (element) {
        this.element = element;
    };

    /**
     * Check if content type is container
     *
     * @returns {boolean}
     */
    Preview.prototype.isContainer = function () {
        return true;
    };

    return Preview;
});
