//----------------------------------------
// BOOTSTRAP RESPONSIVE TABS
//----------------------------------------
/*
 * Lingtalfi 2019-06-07
 *
 * The technique - what happens under the hood
 * ---------
 * Basically, this plugins creates the accordion right away, based on the existing tabs,
 * and then switches the visibility of the tabs or the accordion using bootstrap responsive classes (by default).
 * So there are three responsive classes to configure:
 *
 * - one for the tabs header (containing the tabs)      -- d-none/d-*-flex
 * - one for the tabs content                           -- d-none/d-*-block
 * - one for the accordion                              -- d-block/d-*-none
 *
 * Note: we need two classes for the tabs, because of how bootstrap works: d-none/d-*-block classes are usually
 * used to configure the responsiveness of elements. However the tabs header is a display: flex, and so we need to use
 * the d-none/d-*-flex classes instead, that's why.
 *
 * Note2: if you want more control about the breakpoints, you need to write your own media queries.
 *
 *
 *
 **/
// https://john-dugan.com/jquery-plugin-boilerplate-explained/
;(function ($, window, document, undefined) {


    var pluginName = 'bootstrapResponsiveTabs';


    var uniqueCounter = 1;

    function generateId(prefix) {
        return prefix + '-bsr-unique-' + uniqueCounter++;
    }

    function resolveClassModel(str, breakPoint) {
        return str.replace('*', breakPoint);
    }


    function Plugin(element, options) {


        this._name = pluginName;
        this._defaults = $.fn.bootstrapResponsiveTabs.defaults;
        this.options = $.extend({}, this._defaults, options);

        this.nbTabs = 0;
        this.jTabsHeader = $(element);
        this.jTabsHeaderLinks = $(element).find(this.options.tabTogglerSelector); // cache
        this.jTabsContent = null;
        this.jAccordion = null;


        this.init();
    }

    $.extend(Plugin.prototype, {


        init: function () {

            // find the .tab-content element if not set
            if (null === this.jTabsContent) {

                // by default, we assume that it's next to the tabs header (default bootstrap markup)
                this.jTabsContent = this.jTabsHeader.parent().find('.tab-content:first');
            }


            this.prepareTabs();
            this.buildAccordion();
            this.addResponsiveClasses();
            this.bindSyncEvents();
        },
        /**
         * Will assign an auto-incremented data-item-number attribute to each tab link (in the tabs header).
         * So that we know which tab is clicked, and toggle the corresponding accordion item.
         *
         * Also, we count the number of tabs.
         *
         */
        prepareTabs: function () {
            var $this = this;
            this.jTabsHeaderLinks.each(function () {
                var tabNumber = ++$this.nbTabs;
                $(this).attr('data-item-number', tabNumber);
            });


            this.jTabsHeader.addClass(resolveClassModel(this.options.classModelTabsHeader, this.options.breakPoint));
            this.jTabsContent.addClass(resolveClassModel(this.options.classModelTabsContent, this.options.breakPoint));
        },
        /**
         * Create the accordion based on the current tabs
         */
        buildAccordion: function () {
            var $this = this;
            this.jAccordion = this.jTabsHeader.parent().find('brt-accordion');
            if (0 === this.jAccordion.length) {

                var accordionId = generateId('accordion');
                var cssClass = resolveClassModel(this.options.classModelAccordion, this.options.breakPoint);
                this.jAccordion = $('<div id="' + accordionId + '" class="' + cssClass + '"></div>');
                this.jTabsHeader.parent().append(this.jAccordion);

                // parse all panes and build corresponding accordion items
                var itemCpt = 1;
                this.jTabsContent.find('.tab-pane').each(function () {

                    var ariaSelected = "false";
                    var show = "";
                    if (1 === itemCpt) {
                        ariaSelected = "true";
                        show = "show";

                    }
                    var tabContent = $(this).html();
                    var s = $this.options.accordionItemTemplate;
                    if ('object' === typeof (s)) { // assuming a jquery object
                        s = s.html();
                    }

                    s = s.replace(/\$i/g, itemCpt);
                    s = s.replace(/\$ariaSelected/g, ariaSelected);
                    s = s.replace(/\$show/g, show);
                    s = s.replace(/\$accordionId/g, accordionId);
                    s = s.replace(/\$content/g, tabContent);
                    $this.jAccordion.append(s);
                    itemCpt++;
                });


            }


        },
        addResponsiveClasses: function () {
        },
        bindSyncEvents: function () {
            var $this = this;
            this.jTabsHeaderLinks.on('shown.bs.tab', function (e) {
                var tabNumber = $(e.target).attr("data-item-number");
                var accordionItemIndex = tabNumber - 1;
                var jAccordionItem = $($this.jAccordion.find($this.options.accordionItemTogglerSelector)[accordionItemIndex]);
                jAccordionItem.collapse('show');
            });


            this.jAccordion.find(this.options.accordionItemTogglerSelector).each(function (index) {

                var tabNumber = parseInt(index + 1);
                var element = $(this);
                (function (number, el) {
                    el.on('shown.bs.collapse', function () {
                        $this.jTabsHeaderLinks.each(function () {
                            var currentNumber = parseInt($(this).attr('data-item-number'));
                            if (tabNumber === currentNumber) {
                                $(this).tab('show');
                            }
                        });
                    });
                })(tabNumber, element);

            });
        },

    });


    $.fn.bootstrapResponsiveTabs = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
        return this;
    };


    $.fn.bootstrapResponsiveTabs.defaults = {
        /**
         * Accepts a jquery element or a string like below.
         * The following variables are available:
         * - $i: an auto-incremented number representing the item number, starting at 1
         * - $ariaSelected: a string (true|false), it's true for the first item, and false for the others
         * - $show: a string (show), it's "show" for the first item, and empty for the others
         * - $accordionId: the id of the accordion
         * - $content: the content of the item
         *
         *
         */
        accordionItemTemplate: '<div class="card">\n' +
            '                            <div class="card-header" id="heading-$i">\n' +
            '                                <h5 class="mb-0">\n' +
            '                                    <button class="btn btn-link" data-toggle="collapse"\n' +
            '                                            data-target="#collapse-$i"\n' +
            '                                            aria-expanded="$ariaSelected"\n' +
            '                                            aria-controls="collapse-$i"\n' +
            '                                            data-item-number="$i">\n' +
            '                                        Tab $i\n' +
            '                                    </button>\n' +
            '                                </h5>\n' +
            '                            </div>\n' +
            '\n' +
            '                            <div id="collapse-$i" class="collapse $show"\n' +
            '                                 aria-labelledby="heading-$i"\n' +
            '                                 data-parent="#$accordionId">\n' +
            '                                <div class="card-body">\n' +
            '                                    $content\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                        </div>',
        breakPoint: 'sm',
        /**
         * those three classes are added dynamically once on load
         */
        classModelTabsHeader: 'd-none d-*-flex',
        classModelTabsContent: 'd-none d-*-block',
        classModelAccordion: 'd-block d-*-none',
        /**
         * When you click a tab, which jquery selector do you use to find the corresponding accordion item
         * (the jquery context will be set to jAccordion).
         */
        accordionItemTogglerSelector: '.collapse',
        /**
         * When you click/toggle an accordion item, which jquery selector do you use to find the corresponding tab item
         * (the jquery context will be set to jTabsHeader).
         */
        tabTogglerSelector: 'a[data-toggle="tab"]',

    };

})(jQuery, window, document);