import {Component} from '@angular/core';

@Component({
  standalone: true,
  selector: 'page-not-found',
  imports: [],
  template: `
    <div class="not-found-page">
      <div class="content">
<!--        <img-->
<!--          src="assets/404-funny.png"-->
<!--          alt="404 Not Found"-->
<!--          class="error-image"-->
<!--        />-->
        <h1 class="my-5">404</h1>
        <h2>Ups! Strona nie znaleziona</h2>
      </div>
    </div>
  `,
  styles: `
    .not-found-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #AAA 0%, #D2D2 100%);
      padding: 2rem;
    }

    .content {
      text-align: center;
      background: white;
      padding: 3rem 2rem;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
    }

    .error-image {
      width: 100%;
      max-width: 300px;
      height: auto;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 5rem;
      font-weight: bold;
      color: #f5576c;
      margin: 0;
    }

    h2 {
      font-size: 1.8rem;
      color: #333;
      margin: 1rem 0;
    }

    p {
      font-size: 1.1rem;
      color: #666;
      margin: 1rem 0 2rem;
    }

    .home-button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 500;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .home-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(245, 87, 108, 0.3);
    }
  `,
})
export class NotFoundPage {
}
