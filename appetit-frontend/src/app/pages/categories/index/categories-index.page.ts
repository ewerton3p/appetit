import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Category } from '../../../interfaces/Category';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TableModule, ConfirmDialog],
  templateUrl: './categories-index.page.html',
  styleUrl: './categories-index.page.scss',
})
export class CategoriesIndexPage implements OnInit {
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  categories = signal<Category[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getCategories(1, '').subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as categorias.',
        });
        this.loading.set(false);
      },
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/categories', 'new']);
  }

  edit(category: Category): void {
    this.router.navigate(['/categories', category.id]);
  }

  delete(category: Category): void {
    this.confirmationService.confirm({
      message: `Deseja excluir a categoria <strong>${category.name}</strong>? Esta ação não pode ser desfeita.`,
      header: 'Confirmar exclusão',
      icon: 'heroTrash',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-warning px-4 py-2',
      rejectButtonStyleClass: 'btn-secondary px-4 py-2',
      accept: () => {
        this.categoryService.deleteCategory(category.id!).subscribe({
          next: () => {
            this.categories.update(items => items.filter(c => c.id !== category.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Categoria excluída',
              detail: `"${category.name}" foi excluída com sucesso.`,
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível excluir a categoria.',
            });
          },
        });
      },
    });
  }
}
