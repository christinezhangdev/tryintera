# Accuracy section backup — "We prove our accuracy every day"

This section was removed from the live site for now. To restore it:

1. **HTML**: Paste the block below into `index.html` between the Platform section `</section>` and the Use Cases section `<!-- USE CASES -->`. It has two parts: the main section and the KFF expanded article panel (slide-out).

2. **CSS**: All styles are already in `styles.css` — search for `.accuracy-` to find them. No CSS was removed.

3. **JS**: The accuracy panel open/close logic is in `script.js` (search for "Accuracy KFF card"). It already guards with `if (!panel || !kffCard) return;` so it no-ops when the section is absent; it will work again once you restore the HTML.

---

## What it looked like

- **Headline**: "We prove our accuracy every day."
- **Layout**: `.accuracy-inner` with an h2 and `.accuracy-card-grid` (3 cards in a row on desktop, stacked on small screens).
- **Cards**:
  1. **KFF Health Tracking Poll** — HEALTH BEHAVIOR, 87.4%, expandable (opens article panel). Footer: "11 questions · n = 1,800 · February 2026"
  2. **General Social Survey** — SOCIAL ATTITUDES, 91.2%, placeholder. Footer: "14 questions · n = 2,500 · February 2026"
  3. **Michigan Consumer Sentiment** — CONSUMER SENTIMENT, 86.1%, placeholder. Footer: "8 questions · n = 600 · January 2026"
- **KFF article panel** (slide-out): Header with title and 87.4% stat; "Predicted vs. actual" bar chart (Intera predicted vs KFF actual); "Error distribution" chart; "Where we were strongest" / "Where we struggled" copy; methodology; "← Back to case studies" button. Close via ×, backdrop click, or Escape.

---

## HTML to restore (paste into index.html)

Insert this between `</section>` (end of Platform) and `<!-- USE CASES -->`:

```html
<!-- ACCURACY -->
<section class="accuracy-section fi" id="accuracy">
  <div class="accuracy-inner">
    <h2>We prove our accuracy every day.</h2>
    <div class="accuracy-card-grid">
      <article class="accuracy-card accuracy-card-expandable" data-backtest="kff">
        <div class="accuracy-card-content">
          <div class="accuracy-card-head">
            <span class="accuracy-card-domain"><i class="accuracy-card-dot"></i>HEALTH BEHAVIOR</span>
            <span class="accuracy-card-stat">87.4%</span>
          </div>
          <h3 class="accuracy-card-title">KFF Health Tracking Poll</h3>
          <p class="accuracy-card-desc">Can synthetic Americans predict real healthcare attitudes?</p>
          <footer class="accuracy-card-footer">11 questions · n = 1,800 · February 2026</footer>
        </div>
      </article>
      <article class="accuracy-card accuracy-card-placeholder">
        <div class="accuracy-card-content">
          <div class="accuracy-card-head">
            <span class="accuracy-card-domain"><i class="accuracy-card-dot"></i>SOCIAL ATTITUDES</span>
            <span class="accuracy-card-stat">91.2%</span>
          </div>
          <h3 class="accuracy-card-title">General Social Survey</h3>
          <p class="accuracy-card-desc">Predicting trust, mobility, and social cohesion across America.</p>
          <footer class="accuracy-card-footer">14 questions · n = 2,500 · February 2026</footer>
        </div>
      </article>
      <article class="accuracy-card accuracy-card-placeholder">
        <div class="accuracy-card-content">
          <div class="accuracy-card-head">
            <span class="accuracy-card-domain"><i class="accuracy-card-dot"></i>CONSUMER SENTIMENT</span>
            <span class="accuracy-card-stat">86.1%</span>
          </div>
          <h3 class="accuracy-card-title">Michigan Consumer Sentiment</h3>
          <p class="accuracy-card-desc">Can synthetic consumers predict real economic confidence?</p>
          <footer class="accuracy-card-footer">8 questions · n = 600 · January 2026</footer>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- KFF expanded article with charts -->
<div class="accuracy-article-panel" id="accuracyArticlePanel" hidden aria-hidden="true">
  <div class="accuracy-article-backdrop"></div>
  <div class="accuracy-article-inner">
    <button type="button" class="accuracy-article-close" aria-label="Close">×</button>
    <article class="accuracy-article">
      <header class="accuracy-article-header">
        <span class="accuracy-article-domain">HEALTH BEHAVIOR</span>
        <h1 class="accuracy-article-title">KFF Health Tracking Poll</h1>
        <p class="accuracy-article-meta">February 2026 · 11 questions · n = 1,800</p>
        <div class="accuracy-article-stat">87.4%</div>
      </header>
      <h2>Predicted vs. actual</h2>
      <div class="accuracy-chart-legend">
        <span class="accuracy-legend-item"><i class="accuracy-legend-bar accuracy-legend-predicted"></i> Intera predicted</span>
        <span class="accuracy-legend-item"><i class="accuracy-legend-bar accuracy-legend-actual"></i> KFF actual</span>
      </div>
      <div class="accuracy-bars">
        <div class="accuracy-bar-row">
          <span class="accuracy-bar-label">Worried about medical bill</span>
          <div class="accuracy-bar-pair">
            <div class="accuracy-bar-cell">
              <div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-predicted" style="width:56%"></div></div>
              <span class="accuracy-bar-pct">56%</span>
            </div>
            <div class="accuracy-bar-cell">
              <div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-actual" style="width:53%"></div></div>
              <span class="accuracy-bar-pct">53%</span>
            </div>
          </div>
        </div>
        <div class="accuracy-bar-row">
          <span class="accuracy-bar-label">Skipped care due to cost</span>
          <div class="accuracy-bar-pair">
            <div class="accuracy-bar-cell"><div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-predicted" style="width:29%"></div></div><span class="accuracy-bar-pct">29%</span></div>
            <div class="accuracy-bar-cell"><div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-actual" style="width:26%"></div></div><span class="accuracy-bar-pct">26%</span></div>
          </div>
        </div>
        <div class="accuracy-bar-row">
          <span class="accuracy-bar-label">Favorable view of ACA</span>
          <div class="accuracy-bar-pair">
            <div class="accuracy-bar-cell"><div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-predicted" style="width:52%"></div></div><span class="accuracy-bar-pct">52%</span></div>
            <div class="accuracy-bar-cell"><div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-actual" style="width:54%"></div></div><span class="accuracy-bar-pct">54%</span></div>
          </div>
        </div>
        <div class="accuracy-bar-row">
          <span class="accuracy-bar-label">Difficulty affording Rx</span>
          <div class="accuracy-bar-pair">
            <div class="accuracy-bar-cell"><div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-predicted" style="width:33%"></div></div><span class="accuracy-bar-pct">33%</span></div>
            <div class="accuracy-bar-cell"><div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-actual" style="width:30%"></div></div><span class="accuracy-bar-pct">30%</span></div>
          </div>
        </div>
        <div class="accuracy-bar-row">
          <span class="accuracy-bar-label">Satisfied with care quality</span>
          <div class="accuracy-bar-pair">
            <div class="accuracy-bar-cell"><div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-predicted" style="width:64%"></div></div><span class="accuracy-bar-pct">64%</span></div>
            <div class="accuracy-bar-cell"><div class="accuracy-bar-track"><div class="accuracy-bar accuracy-bar-actual" style="width:67%"></div></div><span class="accuracy-bar-pct">67%</span></div>
          </div>
        </div>
      </div>
      <h2>Error distribution</h2>
      <div class="accuracy-error-chart">
        <span class="accuracy-error-axis">0</span>
        <span class="accuracy-error-axis">5</span>
        <div class="accuracy-error-dot" style="left:60%" title="3 pts"></div>
        <div class="accuracy-error-dot" style="left:60%; top:35%" title="3 pts"></div>
        <div class="accuracy-error-dot" style="left:40%" title="2 pts"></div>
        <div class="accuracy-error-dot" style="left:60%; top:65%" title="3 pts"></div>
        <div class="accuracy-error-dot" style="left:60%; top:80%" title="3 pts"></div>
      </div>
      <p class="accuracy-error-caption">Absolute error by question. Most within 0–3 pts.</p>
      <h2>Where we were strongest</h2>
      <p>Insurance coverage satisfaction and prescription cost burden — both within 1–2 percentage points. These map directly to Consumer Expenditure Survey and MEPS data in our calibration stack.</p>
      <h2>Where we struggled</h2>
      <p>ACA favorability and policy-opinion questions showed wider gaps (2–4 pts). Political sentiment shifts faster than behavioral patterns; our calibration has less signal on opinion formation.</p>
      <div class="accuracy-methodology">
        <p>Population: 1,800 synthetic Americans weighted to KFF demographic breakdown. Questions: 11 core tracking items. Accuracy: 100% − mean absolute percentage error across question-by-subgroup cells.</p>
      </div>
      <button type="button" class="accuracy-article-back">← Back to case studies</button>
    </article>
  </div>
</div>
```
