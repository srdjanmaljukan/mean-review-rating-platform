import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchResult } from '../../models/title.model';

@Component({
  selector: 'app-title-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './title-card.html',
  styleUrl: './title-card.scss',
})
export class TitleCardComponent {
  result = input.required<SearchResult>();
}