import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { TableModule } from 'primeng/table';

interface Category {
  id: number;
  name: string;
  color: string;
}

@Component({
  selector: 'app-categories-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TableModule],
  templateUrl: './categories-index.page.html',
  styleUrl: './categories-index.page.scss',
})
export class CategoriesIndexPage {
  private router = inject(Router);

  categories = signal<Category[]>([
    { id: 1, name: 'Bebidas', color: '#3b82f6' },
    { id: 2, name: 'Sobremesas', color: '#ec4899' },
    { id: 3, name: 'Pratos Principais', color: '#f59e0b' },
  ]);

  navigateToNew(): void {
    this.router.navigate(['/categories', 'new']);
  }

  edit(category: Category): void {
    this.router.navigate(['/categories', category.id]);
  }

  delete(category: Category): void {
    this.categories.update(items => items.filter(c => c.id !== category.id));
  }
}
