import '../../scripts/lib-algoliasearch.js';
import '../../scripts/lib-instant-search.js';

export default function decorate(block) {
  const { algoliasearch, instantsearch } = window;
  const {
    searchBox, stats, hits, configure, panel, refinementList, pagination, rangeSlider
  } = instantsearch.widgets;
  const params = new URL(document.location).searchParams;
  const query = params.get('query');

  block.innerHTML = `
    <div id="searchbox" style="width:100%"></div>
    
    <div style="display: flex;">    
      <div style="flex-shrink: 0; padding: 1rem; width: 30%; ">
        <div id="catLvl0Facet"></div>  
        <div id="colorFacet"></div>
        <div id="priceFacet"></div>
      </div>

      <div style="flex-shrink: 0; padding: 1rem; width: 70%; ">
        <div style="display: flex; justify-content: flex-end; flex-direction: column; ">
          <div style="width: 100%; display: flex; justify-content: flex-end;">
            <div id="stats"></div>
            <div id="sorting"></div>
          </div>
          <div id="hits" style="width: 100%; padding-top: 1rem; display: grid; column-gap: 1rem; row-gap: 1rem; grid-template-columns: repeat(3,minmax(0,1fr));"></div>
          <div id="pagination" style="width: 100%;"></div>
        </div>
      </div>
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
        }),

        hits({
          container: '#hits',
          templates: {
            item: (hit, { html, components }) => 
            html`
              <div class="hover:shadow-lg" "style="position: relative; display: flex; height: 100%; flex-direction: column; justify-content: space-between; border-radius: var(--theme-border-radius-card, .5rem); border-width: 1px; --tw-border-opacity: 1; border-color: rgb(228 228 231 / var(--tw-border-opacity)); transition-property: all; transition-timing-function: cubic-bezier(.4,0,.2,1); transition-duration: .15s; ">
                <a href="${hit.url}">
                  <div style="position: relative; display: flex; flex-shrink: 0; flex-grow: 1; flex-direction: column; padding: 1rem; padding-bottom:0; ">
                    <div style="position: relative;">
                      <div style="margin-left: auto; margin-right: auto; aspect-ratio: 1 / 1; width: 80% padding: 1rem;">
                        <img style="max-width: 100%; height: auto; aspect-ratio: 1 / 1; width: 100%; object-fit: contain;" src="${hit.image_url}" />
                      </div>
                    </div>
                    <div style="position: relative; display: flex; flex-grow: 1; flex-direction: column;">
                      <p style="margin-bottom: 0.25rem; font-size: .75rem; line-height: 1rem; font-weight: 600; text-transform: uppercase;">
                        ${hit.name}
                      </p>
                      <div style="display: flex; flex-grow: 1; align-items: flex-end; justify-content: space-between;">
                        <p style="margin-bottom: 1rem; font-size: .875rem; line-height: 1.25rem; font-weight: 700; color: #003DFF; ">
                          <span>
                            ${hit.price.USD.default_formated}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            `,
          },
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
