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
              <div class="hover:shadow-lg" style="position: relative; display: flex; height: 100%; flex-direction: column; justify-content: space-between; border-radius: .5rem; border-width: 1px; --tw-border-opacity: 1; border-color: rgb(228 228 231)); transition-property: all; transition-timing-function: cubic-bezier(.4,0,.2,1); transition-duration: .15s; ">
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
                <div class="absolute left-3 top-3 z-[20] cursor-pointer stroke-colorBp-primary transition-all hover:scale-110">
                  <svg class="" width="17" height="23" viewBox="0 0 26 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <mask id="B01KMHY2OU" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="23">
                        <rect class="" width="26" height="0" fill="#fff">
                        </rect>
                      </mask>
                    </defs>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1545 18.0197C16.8821 19.0977 15.3329 20.4104 13.2959 22.262C13.2242 22.3276 13.1304 22.364 13.0332 22.364C12.936 22.364 12.8423 22.3276 12.7705 22.262C10.7335 20.4107 9.18454 19.0977 7.91194 18.0197C5.37229 15.8673 3.92261 14.6386 1.94949 11.9911L1.94171 11.9822C1.38917 11.2547 0.986229 10.4248 0.756151 9.5407C0.526074 8.65655 0.473418 7.73558 0.601225 6.83097C0.729032 5.92635 1.03477 5.05602 1.50078 4.27022C1.9668 3.48441 2.58386 2.79871 3.31634 2.25269C4.04881 1.70667 4.8822 1.31116 5.76837 1.089C6.65454 0.866829 7.57594 0.822405 8.47937 0.95829C9.38281 1.09418 10.2504 1.40768 11.032 1.8807C11.8136 2.35371 12.4938 2.97688 13.0332 3.7142C13.5727 2.97688 14.2528 2.35371 15.0344 1.8807C15.816 1.40768 16.6836 1.09418 17.587 0.95829C18.4905 0.822405 19.4119 0.866829 20.298 1.089C21.1842 1.31116 22.0176 1.70667 22.7501 2.25269C23.4825 2.79871 24.0996 3.48441 24.5656 4.27022C25.0316 5.05602 25.3374 5.92635 25.4652 6.83097C25.593 7.73558 25.5403 8.65655 25.3103 9.5407C25.0802 10.4248 24.6772 11.2547 24.1247 11.9822C22.1471 14.6358 20.6972 15.8648 18.1545 18.0197Z"></path><path mask="url(#B01KMHY2OU)" fill-rule="evenodd" clip-rule="evenodd" class="fill-none" d="M18.1545 18.0197C16.8821 19.0977 15.3329 20.4104 13.2959 22.262C13.2242 22.3276 13.1304 22.364 13.0332 22.364C12.936 22.364 12.8423 22.3276 12.7705 22.262C10.7335 20.4107 9.18454 19.0977 7.91194 18.0197C5.37229 15.8673 3.92261 14.6386 1.94949 11.9911L1.94171 11.9822C1.38917 11.2547 0.986229 10.4248 0.756151 9.5407C0.526074 8.65655 0.473418 7.73558 0.601225 6.83097C0.729032 5.92635 1.03477 5.05602 1.50078 4.27022C1.9668 3.48441 2.58386 2.79871 3.31634 2.25269C4.04881 1.70667 4.8822 1.31116 5.76837 1.089C6.65454 0.866829 7.57594 0.822405 8.47937 0.95829C9.38281 1.09418 10.2504 1.40768 11.032 1.8807C11.8136 2.35371 12.4938 2.97688 13.0332 3.7142C13.5727 2.97688 14.2528 2.35371 15.0344 1.8807C15.816 1.40768 16.6836 1.09418 17.587 0.95829C18.4905 0.822405 19.4119 0.866829 20.298 1.089C21.1842 1.31116 22.0176 1.70667 22.7501 2.25269C23.4825 2.79871 24.0996 3.48441 24.5656 4.27022C25.0316 5.05602 25.3374 5.92635 25.4652 6.83097C25.593 7.73558 25.5403 8.65655 25.3103 9.5407C25.0802 10.4248 24.6772 11.2547 24.1247 11.9822C22.1471 14.6358 20.6972 15.8648 18.1545 18.0197Z">
                    </path>
                  </svg>
                </div>
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
