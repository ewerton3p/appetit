import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputText],
  template: `
    <h1 class="page-title">Produto</h1>

    <div class="card max-w-2xl">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="flex flex-col gap-4">

          <div class="flex flex-col gap-1">
            <label for="name" class="text-sm font-medium text-gray-700">
              Nome <span aria-hidden="true" class="text-red-500">*</span>
            </label>
            <input
              pInputText
              id="name"
              formControlName="name"
              placeholder="Nome do produto"
              [attr.aria-invalid]="nameInvalid"
              aria-describedby="name-error"
            />
            @if (nameInvalid) {
              <span id="name-error" class="text-xs text-red-500" role="alert">
                Nome é obrigatório.
              </span>
            }
          </div>

          <div class="flex flex-col gap-1">
            <label for="description" class="text-sm font-medium text-gray-700">
              Descrição
            </label>
            <input
              pInputText
              id="description"
              formControlName="description"
              placeholder="Descrição do produto"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="price" class="text-sm font-medium text-gray-700">
              Preço <span aria-hidden="true" class="text-red-500">*</span>
            </label>
            <input
              pInputText
              id="price"
              formControlName="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              [attr.aria-invalid]="priceInvalid"
              aria-describedby="price-error"
            />
            @if (priceInvalid) {
              <span id="price-error" class="text-xs text-red-500" role="alert">
                Preço é obrigatório e deve ser maior ou igual a zero.
              </span>
            }
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              class="btn-primary px-4 py-2"
              [disabled]="form.invalid"
              [attr.aria-disabled]="form.invalid"
            >
              Salvar
            </button>
            <button
              type="button"
              class="btn-secondary px-4 py-2"
              (click)="cancel()"
            >
              Cancelar
            </button>
          </div>

        </div>
      </form>
    </div>
  `,
})
export class ProductPage {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  get nameInvalid(): boolean {
    const ctrl = this.form.controls.name;
    return ctrl.invalid && ctrl.touched;
  }

  get priceInvalid(): boolean {
    const ctrl = this.form.controls.price;
    return ctrl.invalid && ctrl.touched;
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      // TODO: chamar o serviço de produtos
      this.router.navigate(['/products']);
    }
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
