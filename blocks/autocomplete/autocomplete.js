import '../../scripts/lib-algoliasearch.js';
import '../../scripts/lib-autocomplete.js';
import '../../scripts/lib-autocomplete-plugin-recent-searches.js';

export default function decorate(block) {
  const { algoliasearch } = window;
  const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];
  const { createLocalStorageRecentSearchesPlugin } = window['@algolia/autocomplete-plugin-recent-searches'];

  const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
    key: 'RECENT_SEARCH',
    limit: 5,
  });

  fetch('/config/algolia.json')
    .then(async (response) => {
      const { data } = await response.json();
      const config = new Map(data.map((obj) => [obj.name, obj.value]));
      const searchClient = algoliasearch(
        config.get('appId'),
        config.get('searchApiKey'),
      );

      autocomplete({
        container: block,
        placeholder: config.get('placeholder'),
        plugins: [recentSearchesPlugin],
        openOnFocus: true,

        onSubmit({ state }) {
          window.location.href = `${config.get('resultUrl')}?query=${state.query}&queryID=${state.context.queryID}`;
        },
        
        getSources({ query }) {

          if (!query) {
            return [];
          }

          return [
            {
              sourceId: 'products',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: config.get('indexName'),
                      clickAnalytics: true,
                      query,
                      params: {
                        hitsPerPage: 5,
                        attributesToSnippet: [
                          'name:10',
                          'short_description:35',
                        ],
                        snippetEllipsisText: '…',
                      },
                    },
                  ],
                });
              },
              templates: {
                item({ item, components, html }) {
                  return html`
                    <div style="cursor: pointer; padding-top: 0.75rem; padding-bottom: 0.75rem;">
                      <div style="display: flex; align-items: center;">
                        <div style="position: relative; margin-right: 1rem; width: 5rem; flex-shrink: 0; align-self: center;">
                          <img style="aspect-ratio: 1 / 1; width: 100%; object-fit: contain;" src="${item.image_url}" alt="${item.name}"/>
                        </div>
                        
                        <div style="position: relative; align-self: center;">
                          <p style="margin-bottom: 0.25rem; font-size: .75rem; font-weight: 700; text-transform: uppercase; line-height: 1;">
                            ${components.Highlight({
                              hit: item,
                              attribute: 'name',
                            })}
                          </p>
                          <h3 style="margin-bottom: 0.5rem; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; font-size: .875rem; line-height: 1.375; ">
                            ${components.Snippet({
                              hit: item,
                              attribute: 'short_description',
                            })}
                          </h3>
                          <p style="font-size: .75rem; line-height: 1rem; font-weight: 700; color: #003DFF; ">
                            <span>${item.price.USD.default_formated}</span>
                          </p>
                        </div>

                      </div>
                    </div>
                  `;
                },
              },
            },

            {
              sourceId: 'adventures',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: config.get('adventures_indexName'),
                      clickAnalytics: true,
                      query,
                      params: {
                        hitsPerPage: 5,
                        attributesToSnippet: [
                          'title:10',
                          'jcr_description:35',
                        ],
                        snippetEllipsisText: '…',
                      },
                    },
                  ],
                });
              },
              templates: {
                item({ item, components, html }) {
                  return html`
                <div class="aa-ItemWrapper">
              <div class="aa-ItemContent">
                <div class="aa-ItemIcon aa-ItemIcon--alignTop">
                  <img
                    src="${item.meta.filereference}"
                    alt="${item.title}"
                    width="40"
                    height="40"
                  />
                </div>
                <div class="aa-ItemContentBody">
                  <div class="aa-ItemContentTitle">
                    ${components.Highlight({
    hit: item,
    attribute: 'title',
  })}
                  </div>
                  <div class="aa-ItemContentDescription">
                    ${components.Snippet({
    hit: item,
    attribute: 'jcr_description',
  })}
                  </div>
                </div>
                <div class="aa-ItemActions">
                  <button
                    class="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
                    type="button"
                    title="Select"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path
                        d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
              `;
                },
              },
            },

            {
              sourceId: 'articles',
              getItems() {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: config.get('articles_indexName'),
                      clickAnalytics: true,
                      query,
                      params: {
                        hitsPerPage: 5,
                        attributesToSnippet: [
                          'title:10',
                          'jcr_description:35',
                        ],
                        snippetEllipsisText: '…',
                      },
                    },
                  ],
                });
              },
              templates: {
                item({ item, components, html }) {
                  return html`
                    <a href="${item.path}" target="_blank">
                      <div style="width: 100%; max-width: 36rem; padding-top: 0.75rem; padding-bottom: 0.75rem;" >
                        <div style="position: relative; margin-bottom: 0.5rem; flex: none; align-self: center;">
                          <img style="max-height: 6rem; width: 100%; object-fit: cover;" src="${item.meta.filereference}" />
                        </div>
                        <div syle="position: relative; align-self: center; ">
                          <h3 style="margin-bottom: 0; font-size: .75rem; font-weight: 600; text-transform: capitalize; line-height: 1.375; font-family: system-ui; ">
                            ${components.Highlight({
                              hit: item,
                              attribute: 'title',
                            })}
                          </h3>
                        </div>
                      </div>
                    </a>
                  `;
                },
              },
            },
          ];
        },

        render({ elements, render, html }, root) {
          const { recentSearchesPlugin, products, articles } = elements;

          render(
            html`
              <div class="aa-PanelLayout aa-Panel--scrollable">
                <div style="display:flex; flex-direction: row; justify-content: space-evenly; align-items: stretch">
                  <div style="flex-shrink: 0; padding: 1rem; width: 20%; ">
                    <div class="aa-SourceHeader">
                        <h2 style="text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem; font-family: monospace; font-size: 16px;">
                          Recent Searches
                        </h2>
                      </div>
                      <div>
                        ${recentSearchesPlugin}
                      </div>
                  </div>

                  <div style="padding: 1rem; width: 100%; width: 50%;">
                    <div class="aa-SourceHeader">
                      <h2 style="text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem; font-family: monospace; font-size: 16px;">
                        Products
                      </h2>
                    </div>
                    <div>
                      ${products}
                    </div>
                  </div>

                  <div style="padding: 1rem; width: 30%;">
                    <div class="aa-SourceHeader">
                      <h2 style="text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem; font-family: monospace; font-size: 16px;">
                        Articles
                      </h2>
                    </div>
                    <div>
                      ${articles}
                    </div>
                  </div>
                </div>  
              </div>
            `,
            root
          );
        },
      });
    });
}
