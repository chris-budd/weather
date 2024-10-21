import { redirect } from 'next/navigation';

export default function WeatherRedirect({ searchParams }: { searchParams: { zip?: string } }) {
  const { zip } = searchParams;

  if (zip) {
    redirect(`/weather/${zip}`);
  }

  // If no zip code is provided, redirect to home page
  redirect('/');
}
