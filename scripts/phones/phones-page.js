import PhoneCatalog from './components/phone-catalog.js';
import PhoneViewer from './components/phone-viewer.js';
import PhonesFilter from './components/phones-filter.js';
import ShoppingCart from './components/shopping-cart.js';
import PhoneService from './services/phone-service.js';

export default class PhonesPage {
  constructor({ element }) {
    this._element = element;

    this._render();

    this._initCatalog();
    this._initViewer();
    this._initShoppingCart();
    this._initFilters();
  }

  _initCatalog () {
    this._catalog = new PhoneCatalog({
      element: this._element.querySelector('[data-component="phone-catalog"]'),
    });

    this._loadPhonesFromServer();

    this._catalog.subscribe('phoneSelected', (phoneId) => {
      PhoneService.getPhone(phoneId)
        .then((phoneDetails) => {
          this._catalog.hide();
          this._viewer.show(phoneDetails);
        });
    });

    this._catalog.subscribe('add', (phoneId) => {
      this._shoppingCart.addItem(phoneId);
    });
  }

  _loadPhonesFromServer() {
    PhoneService.getPhones()
      .then((phones) => {
        this._catalog.show(phones);
        this._phones = this._foundPhones = phones;
      });
  }

  _initViewer() {
    this._viewer = new PhoneViewer({
      element: this._element.querySelector('[data-component="phone-viewer"]'),
    });

    this._viewer.subscribe('add', (phoneId) => {
      this._shoppingCart.addItem(phoneId);
    });

    this._viewer.subscribe('back', () => {
      this._viewer.hide();
      this._loadPhonesFromServer();
    });
  }

  _initShoppingCart() {
    this._shoppingCart = new ShoppingCart({
      element: this._element.querySelector('[data-component="shopping-cart"]'),
    });
  }

  _initFilters() {
    this._filter = new PhonesFilter({
      element: this._element.querySelector('[data-component="phones-filter"]'),
    });

      this._filter.subscribe('sort', value => {
          let phonesArray = [];

          if (value.length >= 3) {
              phonesArray = this._phones.filter(phone => {
                  return phone.name.toLowerCase();
              });
          }

          this._foundedPhones = phonesArray.length >= 1 ? phonesArray : this._phones;

          this._catalog.show(this._foundedPhones.sort((a, b) => {
              let [val1, val2] = [a[value], b[value]];

              if (typeof val1 === 'string') {
                  val1 = val1.toLowerCase();
                  val2 = val2.toLowerCase();
              }

              return val1 > val2 ? 1 : -1;
          }));
      });
  }

  _render() {
    this._element.innerHTML = `
      <div class="container-fluid">
        <div class="row">
      
          <!--Sidebar-->
          <div class="col-md-2">
            <section>
              <div data-component="phones-filter"></div>
            </section>
      
            <section>
              <div data-component="shopping-cart"></div>
            </section>
          </div>
      
          <!--Main content-->
          <div class="col-md-10">
            <div data-component="phone-catalog" class="js-hidden"></div>
            <div data-component="phone-viewer" class="js-hidden"></div>
          </div>
        </div>
      </div>
    `;
  }
}
