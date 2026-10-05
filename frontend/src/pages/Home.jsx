import { useEffect } from 'react'
import { useSEO } from '@/utils/seo'
import Hero from '@/components/home/Hero'
import {
  HomeDestinations, HomeHotels, HomeFlights, HomeOffers, HomeCategories,
  HomeTours, HomeReviews, HomeStats, HomeFAQ, HomeCtaStrip, HomeRecentlyViewed,
} from '@/components/home/HomeSections'

export default function Home() {
  useEffect(() => {
    useSEO('Wanderlust — Book Flights, Hotels, Tours & More', 'Premium travel booking platform with flights, hotels, tours, cars and cruises at unbeatable prices.')
  }, [])

  return (
    <>
      <Hero />
      <HomeCtaStrip />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeDestinations />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeHotels />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeFlights />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeOffers />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeCategories />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeTours />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeReviews />
      </div>
      <HomeRecentlyViewed />
      <HomeStats />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <HomeFAQ />
      </div>
    </>
  )
}
