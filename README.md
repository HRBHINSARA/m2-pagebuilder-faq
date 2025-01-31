### Magento 2 FAQ Element for PageBuilder

This repository provides a custom FAQ (Frequently Asked Questions) element designed for Magento 2's PageBuilder. With this extension, store administrators can easily add, manage, and display FAQ sections on their Magento 2 storefronts using the powerful drag-and-drop PageBuilder interface.

#### Features:
- **Easy FAQ Management:** Create and organize questions and answers through the PageBuilder interface.
- **Customizable Design:** Adjust the appearance of FAQ elements to match your store's theme.
- **Responsive Layout:** FAQ elements are fully responsive, ensuring a smooth experience on mobile, tablet, and desktop devices.
- **Optimized for Magento 2:** Seamless integration with the Magento 2 platform, leveraging PageBuilder for easy content editing.

## Requirements

- Magento 2.4.x or later.
- PHP 7.9 or later.
  
#### Installation:

### 1. Download the Extension

Clone the repository into the `app/code/Hrb/PageBuilderVideoExtras` directory of your Magento 2 installation.

```bash
cd /path/to/your/magento/root
git clone https://github.com/HRBHINSARA/m2-pagebuilder-faq.git app/code/
```
### 2. Enable the Module

Run the following commands to enable the module:

```bash
php bin/magento module:enable Hrb_PageBuilderVideoExtras
php bin/magento setup:upgrade
php bin/magento setup:di:compile
php bin/magento cache:clean
```

#### Usage:
Once installed, you can access the FAQ element directly in PageBuilder. Simply drag and drop it onto your page, then configure the content (questions/answers) through the easy-to-use interface.

#### Contributing

If you would like to contribute to this extension, feel free to fork the repository, make changes, and submit a pull request. Please ensure that all code follows Magento 2’s coding standards and that tests are included for any new features.
