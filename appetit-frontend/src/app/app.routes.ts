import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProductsIndexPage } from './pages/products/index/products-index.page';
import { ProductPage } from './pages/products/product/product.page';
import { CategoriesIndexPage } from './pages/categories/index/categories-index.page';
import { CategoryPage } from './pages/categories/category/category.page';

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
      {
        path: 'categories',
        children: [
          { path: '', component: CategoriesIndexPage },
          { path: ':id', component: CategoryPage },
        ],
      },
    ],
  },
];
