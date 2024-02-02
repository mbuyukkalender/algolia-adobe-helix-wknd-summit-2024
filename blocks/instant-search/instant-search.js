import '../../scripts/lib-algoliasearch.js';
import '../../scripts/lib-instant-search.js';

export default function decorate(block) {
  const { algoliasearch, instantsearch } = window;
  const {
    searchBox, stats, hits, configure, panel, refinementList, pagination, rangeSlider
  } = instantsearch.widgets;
  const params = new URL(document.location).searchParams;
  const query = params.get('query');

  const { connectHits } = instantsearch.connectors;

  const openTab = (evt, tabName) => {
    let i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    /*if (document.getElementById(tabName)!= null) {
      document.getElementById(tabName).style.display = "block";
    }
    
    if (evt != null) {
      evt.currentTarget.className += " active";
    }*/
  };


  block.innerHTML = `
    <div id="searchbox" style="width:100%"></div>

    <div class="tab">
      <button class="tablinks" onClick=${openTab(this,"All")}>ALL RESULTS</button>
      <button class="tablinks" onClick=${openTab(this,"Products")}>PRODUCTS</button>
      <button class="tablinks" onClick="alert(this)">ARTICLES</button>
    </div>


    <div id="All" style="display: flex;">
    </div>

    <div id="Products" style="display: flex;">    
      <div style="flex-shrink: 0; padding: 1rem; width: 30%; ">
        <div id="catLvl0Facet"></div>  
        <div id="colorFacet"></div>
        <div id="priceFacet"></div>
      </div>

      <div style="flex-shrink: 0; padding: 1rem; width: 70%; ">
        <div style="display: flex; justify-content: flex-end; flex-direction: column; ">
          <div style="width: 100%; display: flex; justify-content: flex-end; border-top: solid 1px; border-color: rgb(210 210 210);">
            <div id="stats"></div>
            <div id="sorting"></div>
          </div>
          <div id="hits" style="width: 100%; padding-top: 1rem; display: grid; column-gap: 1rem; row-gap: 1rem; grid-template-columns: repeat(3,minmax(0,1fr));"></div>
          <div id="pagination" style="width: 100%;"></div>
        </div>
      </div>
    </div>

    <div id="Articles" style="display: flex;">
    </div>
  `;

  fetch('/config/algolia.json')
    .then(async (response) => {
      const { data } = await response.json();
      const config = new Map(data.map((obj) => [obj.name, obj.value]));

      const searchClient = algoliasearch(
        config.get('appId'),
        config.get('searchApiKey'),
      );

      const search = instantsearch({
        indexName: config.get('indexName'),
        searchClient,
        insights: true,
        routing: {
          stateMapping: {
            stateToRoute(uiState) {
              return {
                query: uiState[config.get('indexName')].query,
              };
            },
            routeToState(routeState) {
              return {
                [config.get('indexName')]: {
                  query: routeState.query,
                },
              };
            },
          },
        },
      });

      const renderHits = (renderOptions, isFirstRender) => {
      const { hits, widgetParams } = renderOptions;
        widgetParams.container.innerHTML = `
            ${hits
              .map(
                item =>
                  `<div id="hit_card" class="transition-all" style="position: relative; display: flex; height: 100%; flex-direction: column; justify-content: space-between; border-width: 1px; border: solid 1px ; border-color: rgb(210 210 210);">
                    <a href="${item.url}" style="text-decoration: none !important; " >
                      <div style="position: relative; display: flex; flex-shrink: 0; flex-grow: 1; flex-direction: column; padding: 1rem; padding-bottom:0; ">
                        <div style="position: relative;">
                          <div style="margin-left: auto; margin-right: auto; aspect-ratio: 1 / 1; width: 80% padding: 1rem;">
                            <img style="max-width: 100%; height: auto; aspect-ratio: 1 / 1; width: 100%; object-fit: contain;" src="${item.image_url}" />
                          </div>
                        </div>
                        <div style="position: relative; display: flex; flex-grow: 1; flex-direction: column;">
                          <p style="margin-bottom: 0.25rem; font-size: .75rem; line-height: 1rem; font-weight: 600; text-transform: uppercase;">
                            ${item.name}
                          </p>
                          <div style="display: flex; flex-grow: 1; align-items: flex-end; justify-content: space-between;">
                            <p style="margin-bottom: 1rem; font-size: .875rem; line-height: 1.25rem; font-weight: 700; color: #003DFF; ">
                              <span>
                                ${item.price.USD.default_formated}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>

                    <div style="padding-left: 1rem; padding-right: 1rem; padding-bottom: 1rem; ">
                      <button class="relative flex w-full  rounded-button bg-colorBp-primary  py-4 text-center text-xs font-semibold leading-none text-colorBp-white transition duration-150 ease-in-out hover:opacity-80">
                        <div class="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 transition-all duration-300 ease-in-out -translate-y-1/2 opacity-100">
                          <span>
                            Add to Cart
                          </span>
                          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cart-shopping" class="svg-inline--fa fa-cart-shopping " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="currentColor" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z">
                            </path>
                          </svg>
                        </div>
                      </button>
                    </div> 
                  </div>`
              )
            .join('')
          }
        `;
      };
      const customHits = connectHits(renderHits);

      search.addWidgets([
        
        searchBox({
          container: '#searchbox',
          placeholder: config.get('placeholder'),
          autofocus: false,
          searchAsYouType: true,
          searchParameters: {
            query,
          },
        }),
        
        stats({
          container: '#stats',
          templates: {
            text(data, { html }) {
              let count = '';

              if (data.hasManyResults) {
                count += `${data.nbHits}`;
              } else if (data.hasOneResult) {
                count += `1`;
              } else {
                count += `no`;
              }

              return html`<p style="font-size: .875rem;"><span style="color: #003DFF; font-weight: 600;">${count} </span>
              <span>results found in</span>
              <span style="color: #003DFF; font-weight: 600;"> ${data.processingTimeMS}ms</span></p>`;
            },
          },
        }),

        customHits({
          container: document.querySelector('#hits'),
        }),

        configure({
          hitsPerPage: 8,
        }),
        
        panel({
          templates: { header: 'category' },
        })(refinementList)({
          container: '#catLvl0Facet',
          attribute: 'categories.level0',
        }),
        panel({
          templates: { header: 'color' },
        })(refinementList)({
          container: '#colorFacet',
          attribute: 'color',
        }),
        panel({
          templates: { header: 'price' },
        })(rangeSlider)({
          container: '#priceFacet',
          attribute: 'price.USD.default',
          pips: false,
        }),

        pagination({
          container: '#pagination',
        }),
      ]);

      search.start();
    });
}
