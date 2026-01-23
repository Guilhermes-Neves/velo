import { test, expect } from '@playwright/test';

/// AAA - Arrange, Act, Assert

test('deve consultar um pedido aprovado', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-FPWLMY');
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();
  
  // Assert
  await expect(page.getByText('VLO-FPWLMY')).toBeVisible({timeout: 10_000});
  await expect(page.getByText('VLO-FPWLMY')).toContainText('VLO-FPWLMY');
  
  await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible();
  // Como deixei a estratégia de buscar pelo texto, comentei o assert pelo texto, pois seria redundante. Com o assert acima caso o texto esteja incorreto o teste falhará.
  //await expect(page.locator('//div[text()="APROVADO"]')).toContainText('APROVADO');
});