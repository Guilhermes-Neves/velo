import { test } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    await app.configurator.validateDefaultConfiguration()

    await app.configurator.selectExteriorColor('Midnight Black')

    await app.configurator.validateCarImageSrc(/midnight-black-aero-wheels/)
    await app.configurator.validatePriceElement('R$ 40.000,00')
  })

  test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    await app.configurator.validateDefaultConfiguration()

    await app.configurator.selectWheels('Sport Wheels')
    await app.configurator.validatePriceElement('R$ 42.000,00')
    await app.configurator.validateCarImageSrc(/glacier-blue-sport-wheels/)

    await app.configurator.selectWheels('Aero Wheels')
    await app.configurator.validatePriceElement('R$ 40.000,00')
    await app.configurator.validateCarImageSrc(/glacier-blue-aero-wheels/)
  })
})
