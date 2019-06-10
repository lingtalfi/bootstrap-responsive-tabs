Bootstrap Responsive Tabs
===============
2019-06-10


A responsive tabs widget for bootstrap 4.





Demo: https://lingtalfi.com/bootstrap-responsive-tabs



Overview
=============

This jquery script basically turns the bootstrap 4 tabs into an accordion (i.e. collapse in bootstrap4 lingo)
when the screen is smaller than a certain breakpoint.

The technique I use is pretty simple:

when the page loads, the plugin creates the accordion version of the existing tabs, 
and then hides one or the other, depending on the screen size. 

The hiding is done using simple bootstrap 4 responsive utility classes (```d-none```, ```d-*-block```, ...).
Please refer to bootstrap documentation if you are not already familiary with those classes.



Options
==========

At the moment, the options are the following (excerpt from the "plugin" source code):


```js

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
```






History Log
------------------
    
- 1.0.0 -- 2019-06-10

    - initial commit
    