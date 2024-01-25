import '../../scripts/lib-algoliasearch.js';
import '../../scripts/lib-autocomplete.js';

export default function decorate(block) {
  const { algoliasearch } = window;
  const { autocomplete, getAlgoliaResults } = window['@algolia/autocomplete-js'];

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
                    <div class="aa-ItemWrapper">
                      <div class="aa-ItemContent">
                        <div class="aa-ItemIcon aa-ItemIcon--alignTop">
                          <img
                            src="${item.image_url}"
                            alt="${item.name}"
                            height="60"
                          />
                        </div>
                        <div class="aa-ItemContentBody">
                          <div class="aa-ItemContentTitle">
                            ${components.Highlight({
                              hit: item,
                              attribute: 'name',
                            })}
                          </div>
                          <div class="aa-ItemContentDescription">
                            ${components.Snippet({
                              hit: item,
                              attribute: 'short_description',
                            })}
                          </div>
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
          ];
        },

        render({ elements, render, html }, root) {
          const { products } = elements;

          render(
            html`<div class="aa-PanelLayout aa-Panel--scrollable">
              <div class="aa-PanelSections">
                <div class="aa-PanelSection--left">
                  
                </div>
                <div class="aa-PanelSection--right">
                  ${products}
                </div>
              </div>
            </div>`,
            root
          );
        },
      });
    });
}
