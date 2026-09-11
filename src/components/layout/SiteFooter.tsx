import { Link } from "@tanstack/react-router";
import { DEALER, formatAddress, formatHour } from "@/lib/dealer";
import { ToyotaMark } from "@/components/brand/ToyotaMark";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <ToyotaMark className="h-7 w-11 text-fg" />
            <strong className="font-display text-lg tracking-[0.16em]">TOYOTA</strong>
          </div>
          <p className="mt-4 text-sm text-muted">{DEALER.name}</p>
          <p className="mt-1 text-sm text-muted">{formatAddress()}</p>
          <a className="mt-3 inline-block text-sm text-fg underline-offset-4 hover:underline" href={`tel:${DEALER.phone.generalTel}`}>
            {DEALER.phone.general}
          </a>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted">Shop</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/vehicles">Vehicles</Link></li>
            <li><Link to="/shop/inventory">Inventory</Link></li>
            <li><Link to="/shop/finance">Finance</Link></li>
            <li><Link to="/shop/trade-in">Trade-In</Link></li>
            <li><Link to="/shop/test-drive">Test Drive</Link></li>
            <li><Link to="/shop/offers">Offers</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted">Owners</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/owners/service">Schedule Service</Link></li>
            <li><Link to="/owners/maintenance">Maintenance</Link></li>
            <li><Link to="/owners/resources">Owner resources</Link></li>
            <li><Link to="/owners/saved">Saved vehicles</Link></li>
            <li><Link to="/account">Account</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-muted">Sales hours</h2>
          <ul className="mt-4 space-y-1 text-sm text-muted">
            {DEALER.hours.sales.map((row) => (
              <li key={row.day} className="flex justify-between gap-4">
                <span>{row.day}</span>
                <span>{formatHour(row.opens, row.closes)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">{DEALER.hoursSource}</p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-muted md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} {DEALER.name}. Toyota and related marks are trademarks of Toyota Motor Corporation.</p>
          <nav className="flex flex-wrap gap-4">
            <Link to="/privacy">Privacy</Link>
            <a href="/privacy#cookies">Cookies</a>
            <Link to="/accessibility">Accessibility</Link>
            <Link to="/legal/disclosures">Disclosures</Link>
            <Link to="/dealership">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
