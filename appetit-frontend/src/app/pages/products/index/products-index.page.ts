import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TableModule } from 'primeng/table';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-products-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TableModule, CurrencyPipe],
  template: `
    <div class="flex items-center justify-between mb-4">
      <h1 class="page-title !mb-0">Produtos</h1>
      <button
        type="button"
        class="btn-primary px-4 py-2"
        (click)="navigateToNew()"
      >
        Novo Produto
      </button>
    </div>

    <div class="card p-0! overflow-hidden">
      <p-table
        [value]="products()"
        [tableStyle]="{ 'min-width': '40rem' }"
        aria-label="Lista de produtos"
      >
        <ng-template pTemplate="header">
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Descrição</th>
            <th scope="col">Preço</th>
            <th scope="col" style="width: 140px">Ações</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
            <td>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="btn-success px-3 py-1.5 text-sm"
                  (click)="edit(product)"
                  [attr.aria-label]="'Editar ' + product.name"
                >
                  <ng-icon name="heroPencilSquare" size="15" aria-hidden="true" />
                  Editar
                </button>
                <button
                  type="button"
                  class="btn-danger px-3 py-1.5 text-sm"
                  (click)="delete(product)"
                  [attr.aria-label]="'Excluir ' + product.name"
                >
                  <ng-icon name="heroTrash" size="15" aria-hidden="true" />
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="4" class="text-center py-8 text-gray-400">
              Nenhum produto cadastrado.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
})
export class ProductsIndexPage {
  private router = inject(Router);

  onInit(): void {
    console.log('onInit');
  }

  products = signal<Product[]>([
    { id: 1, name: 'Pizza Margherita', description: 'Molho de tomate, mozzarella e manjericão', price: 45.90 },
    { id: 2, name: 'Hambúrguer Artesanal', description: 'Carne 180g, queijo cheddar e alface', price: 32.50 },
    { id: 3, name: 'Salada Caesar', description: 'Alface romana, croutons e parmesão', price: 24.00 },
  ]);

  navigateToNew(): void {
    this.router.navigate(['/products', 'new']);
  }

  edit(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }

  delete(product: Product): void {
    this.products.update(items => items.filter(p => p.id !== product.id));
  }
}
