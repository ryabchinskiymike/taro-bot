
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OracleService, TarotReading } from './services/oracle.service';
import { MysticEyeComponent } from './components/mystic-eye.component';
import { CardRevealComponent } from './components/card-reveal.component';
import { HistoryComponent } from './components/history.component';

// Extend Window interface for Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            first_name?: string;
          }
        };
        expand?: () => void;
        ready?: () => void;
      }
    }
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MysticEyeComponent, CardRevealComponent, HistoryComponent],
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  private oracle = inject(OracleService);

  // State Signals
  userName = signal<string>("Путник");
  isLoading = signal<boolean>(false);
  todayReading = signal<TarotReading | undefined>(undefined);
  
  // Computed
  history = computed(() => this.oracle.readings().filter(r => r.date !== this.todayReading()?.date));
  
  // Timer for next reading (simplified for UI)
  hoursUntilNext = computed(() => {
     const now = new Date();
     return 24 - now.getHours();
  });

  ngOnInit() {
    // 1. Initialize Telegram
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      const tgName = window.Telegram.WebApp.initDataUnsafe?.user?.first_name;
      if (tgName) this.userName.set(tgName);
    }

    // 2. Check for existing reading
    this.refreshReading();
  }

  refreshReading() {
    const reading = this.oracle.getTodayReading();
    this.todayReading.set(reading);
  }

  async revealDestiny() {
    this.isLoading.set(true);
    try {
      // Small delay for animation drama
      await new Promise(r => setTimeout(r, 2000));
      
      const reading = await this.oracle.generateDailyReading(this.userName());
      this.todayReading.set(reading);
    } catch (error) {
      console.error("Failed to divine:", error);
      alert("Туман слишком густой... Попробуйте позже.");
    } finally {
      this.isLoading.set(false);
    }
  }
}
