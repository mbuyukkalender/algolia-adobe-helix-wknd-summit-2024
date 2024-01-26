import '../../scripts/lib-algoliasearch.js';
import '../../scripts/lib-instant-search.js';

export default function decorate(block) {
  const { algoliasearch, instantsearch } = window;
  const {
    searchBox, hits, configure, panel, refinementList, pagination,
  } = instantsearch.widgets;
  const params = new URL(document.location).searchParams;
  const query = params.get('query');

  block.innerHTML = `
    <div id="searchbox" style="width:100%"></div>
    <div style="display: flex;">    
      <div style="flex-shrink: 0; padding: 1rem; width: 30%; ">
        <div id="colorFacet"></div>
        <div id="priceFacet"></div>
      </div>

      <div style="flex-shrink: 0; padding: 1rem; width: 70%; ">
        <div id="hits"></div>
        <div id="pagination"></div>
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
        
        hits({
          container: '#hits',
          templates: {
            item: (hit, { html, components }) => 
            html`
              <article>
                <h1>${components.Highlight({ hit, attribute: 'name' })}</h1>
                <p>${components.Highlight({ hit, attribute: 'description' })}</p>
              </article>
            `,
          },
        }),
        
        configure({
          hitsPerPage: 8,
        }),
        
        panel({
          templates: { header: 'brand' },
        })(refinementList)({
          container: '#brand-list',
          attribute: 'brand',
        }),
        
        pagination({
          container: '#pagination',
        }),
      ]);

      search.start();
    });
}
