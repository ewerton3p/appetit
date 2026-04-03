import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TextFieldComponent } from '../../../components/text-field/text-field.component';

@Component({
  selector: 'app-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TextFieldComponent],
  templateUrl: './product.page.html',
  styleUrl: './product.page.scss',
})
export class ProductPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  isNew = signal(true);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNew.set(id === 'new');

    if (id && id !== 'new') {
      // TODO: carregar produto pelo id via serviço
      this.form.patchValue({ name: 'Hambúrguer', description: 'Pão, carne e queijo', price: 29.9 });
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

    // TODO: salvar via serviço
    this.messageService.add({
      severity: 'success',
      summary: this.isNew() ? 'Produto criado' : 'Produto atualizado',
      detail: `"${this.form.value.name}" foi salvo com sucesso.`,
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}
