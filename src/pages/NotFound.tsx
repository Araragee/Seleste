import { ButtonLink } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="text-8xl font-black text-sunset">404</p>
      <h1 className="mt-4 text-3xl font-bold">This page didn't print</h1>
      <p className="mt-2 text-ink/55">The page you're looking for doesn't exist or has moved.</p>
      <ButtonLink to="/" className="mt-8">
        Back home
      </ButtonLink>
    </div>
  )
}
