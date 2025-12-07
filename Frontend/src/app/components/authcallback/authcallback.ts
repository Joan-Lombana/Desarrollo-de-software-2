import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './authcallback.html',
  styleUrls: ['./authcallback.scss']
})
export class AuthCallback {
    private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const token = params['token'];
    if (token) {
      localStorage.setItem('token', token);

      this.auth.getProfile().subscribe({
        next: (user) => {
          console.log('Usuario cargado:', user); // aquí ya tienes nombre, correo, rol
          this.router.navigate(['/principal']);
        },
        error: () => this.router.navigate(['/login'])
      });
    } else {
      this.router.navigate(['/login']);
    }
  });
}
}



