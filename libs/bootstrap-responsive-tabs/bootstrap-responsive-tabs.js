//----------------------------------------
// BOOTSTRAP RESPONSIVE TABS
//----------------------------------------
/*
 * Lingtalfi 2019-06-07 --> 2019-06-11
 *
 * The technique - what happens under the hood
 * ---------
 *
 * Basically, this plugins creates the accordion structure right away, based on the existing tabs,
 * and then stores all the tabs and accordion contents in memory.
 *
 * Then, listening for window resizing, it swaps the content from the tabs to the accordion, or the other way around,
 * depending on the chosen breakpoint.
 *
 *
 * Note: as for now, dynamically added tabs is not supported.
 *
 *
 *
 *
 **/
;(function ($, window, document, undefined) {


    var listeners = [];

    var pluginName = 'bootstrapResponsiveTabs';


    var uniqueCounter = 1;

    function generateId(prefix) {
        return prefix + '-bsr-unique-' + uniqueCounter++;
    }


    function Plugin(element, options) {


        this._name = pluginName;
        this._defaults = $.fn.bootstrapResponsiveTabs.defaults;
        this.options = $.extend({}, this._defaults, options);


        // translating bootstrap breakpoints into numbers (https://getbootstrap.com/docs/4.0/layout/overview/).
        if ('sm' === this.options.breakPoint) {
            this.options.breakPoint = 576;
        } else if ('md' === this.options.breakPoint) {
            this.options.breakPoint = 768;
        } else if ('lg' === this.options.breakPoint) {
            this.options.breakPoint = 992;
        } else if ('xl' === this.options.breakPoint) {
            this.options.breakPoint = 1200;
        }


        this.targets = {};


        this.nbTabs = 0;
        this.jTabsHeader = $(element);
        this.jTabsHeaderLinks = $(element).find(this.options.tabTogglerSelector); // cache
        this.jTabsContent = null;
        this.jAccordion = null;


        // whether the widget is currently in accordion or tab form
        this.isAccordion = false;


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
            this.prepareStructure();
            this.bindSyncEvents();


            // trigger the first event manually
            var windowSize = $(window).width();
            if (windowSize < this.options.breakPoint) {
                this.isAccordion = true;
                this.jTabsContent.hide();
                this.jTabsHeader.hide();
                this.jAccordion.show();
            } else {
                this.isAccordion = false;
                this.jTabsContent.show();
                this.jTabsHeader.show();
                this.jAccordion.hide();
            }


        },
        turnToAccordion: function () {
            if (false === this.isAccordion) {
                for (var i in this.targets) {
                    var jTabContent = this.targets[i]['tabContent'];
                    var jAccordionContent = this.targets[i]['accordionContent'];
                    jAccordionContent.empty();
                    jTabContent.clone().find('*').detach().appendTo(jAccordionContent);
                }

                this.jTabsContent.hide();
                this.jTabsHeader.hide();
                this.jAccordion.show();
                this.isAccordion = true;

            }
        },
        turnToTabs: function () {
            if (true === this.isAccordion) {
                for (var i in this.targets) {
                    var jTabContent = this.targets[i]['tabContent'];
                    var jAccordionContent = this.targets[i]['accordionContent'];
                    jTabContent.empty();
                    jAccordionContent.clone().find('*').detach().appendTo(jTabContent);
                }
                this.jTabsContent.show();
                this.jTabsHeader.show();
                this.jAccordion.hide();
                this.isAccordion = false;
            }
        },
        listen: function (screenWidth) {
            if (screenWidth < this.options.breakPoint) {
                this.turnToAccordion();
            } else {
                this.turnToTabs();
            }
        },
        /**
         * Will assign an auto-incremented data-item-number attribute to each tab link (in the tabs header).
         * So that we know which tab is clicked, and toggle the corresponding accordion item.
         *
         */
        prepareTabs: function () {
            var $this = this;
            this.jTabsHeaderLinks.each(function () {
                var tabNumber = ++$this.nbTabs;
                $(this).attr('data-item-number', tabNumber);
            });
        },
        /**
         * Create the accordion based on the current tabs, store targets, and add responsive classes.
         */
        prepareStructure: function () {
            var $this = this;


            this.jAccordion = this.jTabsHeader.parent().find('brt-accordion');
            if (0 === this.jAccordion.length) {

                var jAccordionContent;
                var jAccordionHeaderLink;


                var accordionId = generateId('accordion');


                this.jAccordion = $('<div id="' + accordionId + '"></div>');
                this.jTabsHeader.parent().append(this.jAccordion);

                // parse all panes and build corresponding accordion items
                var itemCpt = 1;
                this.jTabsContent.find('.tab-pane').each(function () {


                    $this.targets[itemCpt] = {
                        'tabContent': $(this),
                    };


                    var isPaneSelected = $(this).hasClass('show');


                    var ariaSelected = "false";
                    var show = "";
                    if (true === isPaneSelected) {
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
                    var jAccordionItem = $(s);
                    $this.jAccordion.append(jAccordionItem);


                    jAccordionHeaderLink = jAccordionItem.find('[data-toggle="collapse"]');
                    $this.targets[itemCpt]['accordionHeaderLink'] = jAccordionHeaderLink;



                    jAccordionContent = jAccordionItem.find('#collapse-' + itemCpt);
                    if (null !== $this.options.targetAccordionContent) {
                        jAccordionContent = jAccordionContent.find($this.options.targetAccordionContent);
                    }
                    $this.targets[itemCpt]['accordionContent'] = jAccordionContent;


                    itemCpt++;
                });


                var n;
                this.jTabsHeaderLinks.each(function(){
                     n = $(this).attr("data-item-number");
                     $this.targets[n]['accordionHeaderLink'].text($(this).text());
                });

            }
        },
        /**
         * Ensure that when a tab is clicked, the corresponding accordion item is toggled, and vice-versa.
         */
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
                var inst = new Plugin(this, options);
                listeners.push(inst);
                $.data(this, "plugin_" + pluginName, inst);
            }
        });
        return this;
    };


    $(window).on('resize.bootstrapResponsiveTabs', function () {
        var screenWidth = $(window).width();
        for (var i in listeners) {
            listeners[i].listen(screenWidth);
        }
    });


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
        /**
         * The threshold below which the tabs turn into accordions.
         * We can use either a number (of pixels), or a bootstrap 4 class equivalent:
         * - sm: 576
         * - md: 768
         * - lg: 992
         * - xl: 1200
         */
        breakPoint: 'sm',
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
        /**
         * When transforming from tabs to accordion,
         * the tab content is inserted into the corresponding accordion content.
         * However, sometimes you want the tab content to be inserted into a specific sub-element of the
         * accordion content. That specific sub-element is defined here: using a jquery selector (with the context
         * being the accordion content).
         * If null, the tab content will be inserted directly at the root of the accordion content (the element
         * with the collapse css class).
         */
        targetAccordionContent: ".card-body",

    };

})(jQuery, window, document);