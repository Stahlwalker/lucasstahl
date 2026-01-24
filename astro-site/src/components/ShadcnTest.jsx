import { Button } from "@/components/ui/button"

export default function ShadcnTest() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>shadcn/ui Component Test</h2>
      <p style={{ marginBottom: '1rem' }}>Testing shadcn/ui buttons with Tailwind CSS (utilities only)</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <Button>Default Button</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  )
}
