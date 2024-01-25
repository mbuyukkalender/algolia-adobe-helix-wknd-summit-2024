function cx(...classNames) {
  return classNames.filter(Boolean).join(' ');
}

function formatPrice(value, currency) {
  return value.toLocaleString('en-US', { style: 'currency', currency });
}

export function ProductItem({ html, hit, components }) {
  return html`
    <a
      href="https://example.org/"
      target="_blank"
      rel="noreferrer noopener"
      class="${cx('aa-ItemLink', hit.objectID)}"
    >
      <div class="aa-ItemContent">
        <div class="aa-ItemPicture">
          <img
            src="${hit.image_urls[0]}"
            alt="${hit.name}"
            onLoad=${() => {
              const imgEl = document.querySelector(
                `.${hit.objectID} .aa-ItemPicture`
              );
              imgEl.classList.add('aa-ItemPicture--loaded');
            }}
          />
        </div>

        <div class="aa-ItemContentBody">
          <div>
            ${hit.brand &&
            html`
              <div class="aa-ItemContentBrand">
                ${components.Highlight({ hit, attribute: 'brand' })}
              </div>
            `}
            <div class="aa-ItemContentTitleWrapper">
              <div class="aa-ItemContentTitle">
                ${components.Highlight({ hit, attribute: 'name' })}
              </div>
            </div>
          </div>
          <div>
            <div class="aa-ItemContentPrice">
              <div class="aa-ItemContentPriceCurrent">
                ${formatPrice(hit.price.value, hit.price.currency)}
              </div>
              ${hit.price.on_sales &&
              html`
                <div class="aa-ItemContentPriceDiscounted">
                  ${formatPrice(hit.price.discounted_value, hit.price.currency)}
                </div>
              `}
            </div>
            <div class="aa-ItemContentRating">
              <ul>
                ${Array(5)
                  .fill(null)
                  .map(
                    (_, index) =>
                      html`<li key="${index}">
                        <div
                          class="${cx(
                            'aa-ItemIcon aa-ItemIcon--noBorder aa-StarIcon',
                            index >= hit.reviews.rating && 'aa-StarIcon--muted'
                          )}"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </div>
                      </li>`
                  )}
              </ul>
              <span class="aa-ItemContentRatingReviews">
                (${hit.reviews.count})
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  `;
}