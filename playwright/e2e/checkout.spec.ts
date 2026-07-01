import { test, expect } from '../support/fixtures'
import { createCheckoutActions } from '../support/actions/checkoutActions'
import { deleteOrderByEmail } from '../support/database/orderRepository'

test.describe('Checkout', () => {
  test.describe('Validações de campos obrigatórios', () => {
    let alerts: ReturnType<typeof createCheckoutActions>['elements']['alerts']

    test.beforeEach(async ({ page, app }) => {
      await page.goto('/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
      alerts = app.checkout.elements.alerts
    });

    test('deve validar obrigatoriedade de todos os campos em branco', async ({ app }) => {
      app.checkout.submit()

      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres');
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
      await expect(alerts.email).toHaveText('Email inválido');
      await expect(alerts.phone).toHaveText('Telefone inválido');
      await expect(alerts.document).toHaveText('CPF inválido');
      await expect(alerts.store).toHaveText('Selecione uma loja');
      await expect(alerts.terms).toHaveText('Aceite os termos');
    });

    test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ app }) => {
      const customer = {
        name: 'A',
        lastname: 'B',
        email: 'neves@teste.com',
        phone: '(11) 99999-9999',
        document: '00000014141'
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()
      await app.checkout.submit();

      await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres');
      await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
    });

    test('deve exibir erro para e-mail com formato inválido', async ({ app }) => {
      const customer = {
        name: 'Guilherme',
        lastname: 'Neves',
        email: 'neves.com',
        phone: '(11) 99999-9999',
        document: '00000014141'
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()
      await app.checkout.submit();

      await expect(alerts.email).toHaveText('Email inválido');
    });

    test('deve exibir erro para CPF inválido', async ({ app }) => {
      const customer = {
        name: 'Guilherme',
        lastname: 'Neves',
        email: 'neves@teste.com',
        phone: '(11) 99999-9999',
        document: '123'
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')
      await app.checkout.acceptTerms()
      await app.checkout.submit();

      await expect(alerts.document).toHaveText('CPF inválido');
    });

    test('deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ app }) => {
      const customer = {
        name: 'Guilherme',
        lastname: 'Neves',
        email: 'neves@teste.com',
        phone: '(11) 99999-9999',
        document: '00000014141'
      }

      await app.checkout.fillCustomerData(customer)
      await app.checkout.selectStore('Velô Paulista')

      await expect(app.checkout.elements.termsCheckbox).not.toBeChecked()

      await app.checkout.submit();

      await expect(alerts.terms).toHaveText('Aceite os termos');
    });
  })

  test.describe('Pagamento à vista - fluxo feliz', () => {
    test('deve criar pedido aprovado com pagamento à vista', async ({ app }) => {
      const order = {
        customer: {
          name: 'Maria',
          lastname: 'Silva',
          email: 'maria.silva@email.com',
          phone: '(11) 98765-4321',
          document: '52998224725',
        },
        store: 'Velô Paulista - Av. Paulista, 1000',
        totalPrice: 'R$ 40.000,00'
      }

      await deleteOrderByEmail(order.customer.email)

      await app.configurator.open()
      await app.configurator.validateDefaultConfiguration()
      await app.configurator.finishConfigurator()
      await app.checkout.validateLoaded()
      await app.checkout.validateSummaryTotalPrice(order.totalPrice)

      await app.checkout.fillCustomerData(order.customer)
      await app.checkout.selectStore(order.store)
      await app.checkout.selectPaymentAvista()
      await app.checkout.validateAvistaPaymentPrice(order.totalPrice)
      await app.checkout.validateSummaryTotalPrice(order.totalPrice)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.validateApprovedOrderSuccess({
        customerFullName: order.customer.name + ' ' + order.customer.lastname,
        email: order.customer.email,
        store: order.store,
        totalPrice: order.totalPrice,
      })
    })

    test('Validar aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento.', async ({ page, app }) => {
      const order = {
        customer: {
          name: 'Steve',
          lastname: 'Woz',
          email: 'steve.woz@email.com',
          phone: '(11) 98765-4321',
          document: '60171533070',
        },
        store: 'Velô Paulista - Av. Paulista, 1000',
        paymenthMethod: 'Financimento',
        totalPrice: 'R$ 40.000,00',
        totalWithTax: 'R$ 40.800,00'
      }

      await deleteOrderByEmail(order.customer.email)

      await page.route('**/functions/v1/credit-analysis', async route => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'Done',
            score: 710,
          }),
        });
      });

      await app.configurator.open()
      await app.configurator.validateDefaultConfiguration()
      await app.configurator.finishConfigurator()
      await app.checkout.validateLoaded()
      await app.checkout.validateSummaryTotalPrice(order.totalPrice)

      await app.checkout.fillCustomerData(order.customer)
      await app.checkout.selectStore(order.store)
      await app.checkout.selectPaymentFinanciamento()
      await app.checkout.validateAvistaPaymentPrice(order.totalPrice)
      await app.checkout.validateSummaryTotalPrice(order.totalWithTax)
      await app.checkout.acceptTerms()
      await app.checkout.submit()

      await app.checkout.validateApprovedOrderSuccess({
        customerFullName: order.customer.name + ' ' + order.customer.lastname,
        email: order.customer.email,
        store: order.store,
        totalPrice: order.totalWithTax,
      })
    })
  })
});