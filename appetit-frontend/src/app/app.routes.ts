import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProductsIndexPage } from './pages/products/index/products-index.page';
import { ProductPage } from './pages/products/product/product.page';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'products',
        children: [
          { path: '', component: ProductsIndexPage },
          { path: ':id', component: ProductPage },
        ],
      },
    ],
  },
];
