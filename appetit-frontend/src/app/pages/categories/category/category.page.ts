import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ColorPicker } from 'primeng/colorpicker';
import { TextFieldComponent } from '../../../components/text-field/text-field.component';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ColorPicker, TextFieldComponent],
  templateUrl: './category.page.html',
  styleUrl: './category.page.scss',
})
export class CategoryPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);

  isNew = signal(true);
  loading = signal(false);
  private categoryId: number | null = null;

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    color: ['6366f1', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNew.set(id === 'new');

    if (id && id !== 'new') {
      this.categoryId = Number(id);
      this.loading.set(true);
      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (response) => {
          const color = response.data.color?.replace('#', '') ?? '6366f1';
          this.form.patchValue({ name: response.data.name, color });
          this.loading.set(false);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar a categoria.',
          });
          this.loading.set(false);
          this.router.navigate(['/categories']);
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Formulário inválido',
        detail: 'Corrija os campos destacados antes de continuar.',
      });
      return;
    }

    const category = {
      id: this.categoryId ?? undefined,
      name: this.form.value.name,
      color: '#' + this.form.value.color,
    };

    this.loading.set(true);

    if (this.isNew()) {
      this.categoryService.createCategory(category).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Categoria criada',
            detail: `"${category.name}" foi criada com sucesso.`,
          });
          this.router.navigate(['/categories']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível criar a categoria.',
          });
          this.loading.set(false);
        },
      });
    } else {
      this.categoryService.updateCategory(category).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Categoria atualizada',
            detail: `"${category.name}" foi atualizada com sucesso.`,
          });
          this.router.navigate(['/categories']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível atualizar a categoria.',
          });
          this.loading.set(false);
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
