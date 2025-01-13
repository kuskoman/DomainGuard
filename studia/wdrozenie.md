# Procedura Odbioru i Wdrożenia Produktu

## Procedura Odbioru Produktu

### Odbiór i Sprawdzenie Funkcjonalności

1. **Środowisko testowe:**
   - Przygotowanie środowiska testowego przez wykonawcę, zawierającego wszystkie elementy aplikacji: backend, frontend oraz wymagane usługi (Redis, PostgreSQL).
   - Środowisko testowe umożliwia weryfikację pełnej funkcjonalności systemu, zanim zostanie wdrożony na środowisko produkcyjne.

2. **Testy akceptacyjne:**
   - Przeprowadzenie testów funkcjonalnych, wydajnościowych oraz integracyjnych na środowisku staging, które symuluje środowisko produkcyjne.
   - Weryfikacja, czy system spełnia wymagania określone w specyfikacji.

3. **Protokół zgodności:**
   - Sporządzenie protokołu zgodności przez wykonawcę, zawierającego:
     - Wyniki testów funkcjonalnych.
     - Raport z testów wydajnościowych.
     - Dokumentację przeglądu kodu.
   - Protokół musi być zatwierdzony przez klienta.

4. **Harmonogram poprawek:**
   - W przypadku wykrycia usterek wykonawca dostarcza harmonogram ich usunięcia.
   - Klasyfikacja priorytetów:
     - Krytyczne: naprawa w ciągu 24 godzin.
     - Wysokie: naprawa w ciągu 3 dni roboczych.
     - Średnie i niskie: naprawa w ciągu 7 dni roboczych.

---

## Procedura Wdrożenia Produktu

### Warunki Wstępne Techniczne

1. **Infrastruktura:**
   - System wdrażany jest na klastrze Kubernetes z możliwością użycia Helm.
   - Baza danych PostgreSQL w wersji 14+ (zalecane RDS).
   - Redis zainstalowany jako część konfiguracji Helm.

2. **Przygotowanie konfiguracji:**
   - Dostarczenie przez klienta odpowiednich danych do połączenia z bazą danych i Redis.
   - Utworzenie sekrety zawierającej informacje o połączeniach.

3. **Zasoby aplikacyjne:**
   - Backend: obraz Docker umieszczony w GHCR.
   - Frontend: możliwość użycia obrazu Docker lub plików statycznych do dystrybucji.

---

### Proces Wdrożenia

1. **Przygotowanie środowiska:**
   - Stworzenie dedykowanego środowiska (namespace) w Kubernetes dla aplikacji.
   - Wprowadzenie konfiguracji środowiskowej i ustawień specyficznych dla danego środowiska.

2. **Instalacja aplikacji:**
   - Backend i frontend instalowane są przy użyciu Helm z wykorzystaniem przygotowanego Helm chartu.
   - Wykonanie migracji bazy danych jako integralnej części wdrożenia.

3. **Monitorowanie wdrożenia:**
   - Obserwacja działania systemu w czasie rzeczywistym w celu szybkiego reagowania na ewentualne problemy.
   - Weryfikacja poprawności działania kluczowych funkcji systemu.

4. **Synchronizacja wersji:**
   - Wdrożenie automatyczne realizowane z pomocą ArgoCD lub alternatywnego narzędzia do synchronizacji wersji aplikacji ze stanem w repozytorium Git.

## Kopia Zapasowa i Odtwarzanie

### Kopia Zapasowa

1. **PostgreSQL:**
   - Regularne tworzenie kopii zapasowych bazy danych przy użyciu odpowiednich narzędzi lub snapshotów RDS.
   - Przechowywanie kopii zgodnie z wytycznymi RODO.

2. **Redis:**
   - Backup kluczy sesji, aby zapobiec wylogowaniu użytkowników w przypadku awarii.

3. **Strategia przechowywania:**
   - Kopie zapasowe przechowywane są w bezpiecznej lokalizacji, z możliwością odzyskania danych w krótkim czasie.

### Odtwarzanie Systemu

1. **Przygotowanie środowiska:**
   - Stworzenie odpowiedniej infrastruktury, w tym namespace i sekrety.
   - Przygotowanie dostępu do kopii zapasowych.

2. **Odtworzenie danych:**
   - Przywrócenie danych z kopii zapasowej PostgreSQL.
   - Zaimportowanie sesji użytkowników w Redis.

3. **Odtworzenie aplikacji:**
   - Ponowne wdrożenie aplikacji na przygotowanym środowisku.
   - Walidacja poprawności działania systemu i funkcji aplikacji.

### Walidacja

- Po zakończeniu wdrożenia wykonawca i klient wspólnie weryfikują poprawność działania aplikacji.
- Weryfikacja obejmuje testy akceptacyjne oraz ocenę zgodności systemu z wymaganiami.
