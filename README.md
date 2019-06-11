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

when the page loads, the plugin creates the accordion version of the existing tabs. Then, it swaps/hides the corresponding elements depending on the screen size. 



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
```


How to use
=============

Just look at the source code of the demo (see the link at the top of this document).

Basically, create some tab navigation first (using regular bootstrap markup):


```html
<ul class="nav nav-tabs d-none d-sm-flex" id="myTab" role="tablist">
    <li class="nav-item">
        <a class="nav-link active" id="tab-1" data-toggle="tab" href="#pane-1" role="tab" aria-controls="#pane-1" aria-selected="true" data-item-number="1">Tab 1</a>
    </li>
    <li class="nav-item">
        <a class="nav-link " id="tab-2" data-toggle="tab" href="#pane-2" role="tab" aria-controls="#pane-2" aria-selected="false" data-item-number="2">Tab 2</a>
    </li>
    <li class="nav-item">
        <a class="nav-link " id="tab-3" data-toggle="tab" href="#pane-3" role="tab" aria-controls="#pane-3" aria-selected="false" data-item-number="3">Tab 3</a>
    </li>
    <li class="nav-item">
        <a class="nav-link " id="tab-4" data-toggle="tab" href="#pane-4" role="tab" aria-controls="#pane-4" aria-selected="false" data-item-number="4">Tab 4</a>
    </li>
    <li class="nav-item">
        <a class="nav-link " id="tab-5" data-toggle="tab" href="#pane-5" role="tab" aria-controls="#pane-5" aria-selected="false" data-item-number="5">Tab 5</a>
    </li>
</ul>
<div class="tab-content d-none d-sm-block" id="myTabContent">
    <div class="tab-pane fade p-5 show active" id="pane-1" role="tabpanel" aria-labelledby="tab-1">
        <h2>Content of tab 1</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cupiditate dicta
            harum non
            repellendus rerum tenetur unde voluptatibus. Excepturi, expedita!
        </p>
    </div>
    <div class="tab-pane fade p-5 " id="pane-2" role="tabpanel" aria-labelledby="tab-2">
        <h2>Content of tab 2</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cupiditate dicta
            harum non
            repellendus rerum tenetur unde voluptatibus. Excepturi, expedita!
        </p>
    </div>
    <div class="tab-pane fade p-5 " id="pane-3" role="tabpanel" aria-labelledby="tab-3">
        <h2>Content of tab 3</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cupiditate dicta
            harum non
            repellendus rerum tenetur unde voluptatibus. Excepturi, expedita!
        </p>
    </div>
    <div class="tab-pane fade p-5 " id="pane-4" role="tabpanel" aria-labelledby="tab-4">
        <h2>Content of tab 4</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cupiditate dicta
            harum non
            repellendus rerum tenetur unde voluptatibus. Excepturi, expedita!
        </p>
    </div>
    <div class="tab-pane fade p-5 " id="pane-5" role="tabpanel" aria-labelledby="tab-5">
        <h2>Content of tab 5</h2>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi cupiditate dicta
            harum non
            repellendus rerum tenetur unde voluptatibus. Excepturi, expedita!
        </p>
    </div>
</div>



```


That was the hard part.
And now call the jquery plugin:


```js
$(document).ready(function () {
    $('#myTab').bootstrapResponsiveTabs({
        breakPoint: "sm",
        targetAccordionContent: ".card-body",
        // accordionItemTemplate: $('#accordion-item-template-wrapper .card:first'),
    });
});
```





History Log
------------------
    
- 1.1.1 -- 2019-06-11

    - fix tab header links not transferred

- 1.1.0 -- 2019-06-11

    - fix implementation not working, and bad approach not swapping content (type in an input not transferred for instance)

- 1.0.0 -- 2019-06-10

    - initial commit
    