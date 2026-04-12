import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { Category } from '../../../interfaces/Category';
import { Pagination } from '../../../interfaces/Pagination';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TableModule, ConfirmDialog, Paginator, ReactiveFormsModule],
  templateUrl: './categories-index.page.html',
  styleUrl: './categories-index.page.scss',
})
export class CategoriesIndexPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  private destroy$ = new Subject<void>();

  categories = signal<Category[]>([]);
  loading = signal(false);
  pagination = signal<Pagination>({ page: 1, totalPages: 1, totalItems: 0 });
  pageSize = computed(() => Math.ceil(this.pagination().totalItems / this.pagination().totalPages));

  searchControl = new FormControl('');
  private currentPage = 1;

  ngOnInit(): void {
    this.loadCategories(1, '');

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => {
        this.currentPage = 1;
        this.loading.set(true);
        return this.categoryService.getCategories(1, term ?? '');
      }),
      takeUntil(this.destroy$),
    ).subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.pagination.set(response.pagination);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível realizar a pesquisa.',
        });
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(page: number, search: string): void {
    this.loading.set(true);
    this.categoryService.getCategories(page, search).subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.pagination.set(response.pagination);
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

  onPageChange(event: PaginatorState): void {
    this.currentPage = (event.page ?? 0) + 1;
    this.loadCategories(this.currentPage, this.searchControl.value ?? '');
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
