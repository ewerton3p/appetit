import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColorPicker } from 'primeng/colorpicker';
import { TextFieldComponent } from '../../../components/text-field/text-field.component';

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

  isNew = signal(true);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    color: ['6366f1', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isNew.set(id === 'new');

    if (id && id !== 'new') {
      // TODO: carregar categoria pelo id via serviço
      this.form.patchValue({ name: 'Bebidas', color: '3b82f6' });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: salvar via serviço
    this.router.navigate(['/categories']);
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}
