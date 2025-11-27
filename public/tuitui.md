# TUITUI BreakDown for search-results-mfe

## What is the Search Results MFE?

The Search Results MFE (Micro Frontend) is a standalone web application that displays holiday packages and accommodation options to TUI customers. It's the "results page" that users see after searching for holidays - showing hotels, flights, prices, and all the details needed to choose a vacation.

## How it Works

### High-Level Flow

1. **User Search** → A customer searches for holidays (destination, dates, travelers, etc.)
2. **Request Processing** → The MFE receives search parameters and sends them to backend services
3. **Data Fetching** → Backend services retrieve available holidays, prices, and availability
4. **Display Results** → The MFE shows holiday cards with images, prices, ratings, and key information
5. **Filtering & Sorting** → Users can refine results by price, ratings, facilities, flight times, etc.
6. **Selection** → When a user clicks a holiday, they're taken to the next step in the booking journey

### Architecture Overview

The application is split into three main parts:

**BFF (Backend For Frontend)**

- Acts as a middleman between the UI and TUI's backend services
- Handles GraphQL queries from the UI
- Communicates with external APIs (FCA for accommodation, USL for listings)
- Transforms backend data into formats the UI needs
- Manages error handling and data validation

**UI (User Interface)**

- The visual layer customers interact with
- Displays product cards showing holidays with images, prices, and details
- Provides filters (price range, star rating, board basis, facilities, etc.)
- Handles sorting options (price, popularity, rating, etc.)
- Manages user interactions (clicking, filtering, viewing details)
- Built with Preact for performance

**Common**

- Shared code used by both BFF and UI
- Constants, utilities, and type definitions
- Ensures consistency across the application

### Key Features

**Product Display**

- Holiday cards showing hotel images, names, locations
- Price information including discounts and deposit options
- Customer and TripAdvisor ratings
- Key features (TUI Blue, free child places, etc.)

**Filtering System**

- Price range slider
- Star ratings and customer review scores
- Board basis (all-inclusive, half-board, etc.)
- Facilities (pool, spa, Wi-Fi, etc.)
- Flight preferences (departure times, airlines, airports)
- Accessibility options
- Holiday types (family-friendly, adults-only, etc.)

**Additional Functionality**

- Alternative date suggestions when results are limited
- Map view to see hotel locations
- Image galleries for properties
- Flight details dialog
- Shortlist/favorites functionality
- Responsive design for mobile and desktop

### Data Flow Example

1. Customer searches for "Mallorca, 2 adults, 7 nights, July"
2. UI sends GraphQL query to BFF with search parameters
3. BFF transforms query and calls USL service for listings
4. BFF calls FCA service for detailed accommodation info
5. BFF combines and transforms data into UI-friendly format
6. UI receives data and renders product cards
7. Customer applies filter "5-star hotels with pool"
8. UI filters results client-side without new backend call
9. Customer clicks "Sort by price: low to high"
10. UI re-orders the displayed results

### Technical Approach

- **Monorepo structure**: All related code lives together but is organized into workspaces
- **GraphQL**: BFF uses GraphQL to provide flexible data querying for the UI
- **Type safety**: TypeScript throughout ensures fewer bugs and better developer experience
- **Testing**: Unit tests, integration tests (Pact), and end-to-end tests ensure reliability
- **Localization**: Supports multiple markets (UK, Netherlands, Belgium, Nordics, Ireland)
- **Performance**: Preact and signals for fast rendering, lazy loading for images

## File Structure

.
├── bff
│ ├── api
│ │ └── specs
│ │ ├── fca
│ │ │ └── models
│ │ └── usl
│ │ └── models
│ ├── src
│ │ ├── clients
│ │ │ └── mocks
│ │ ├── constants
│ │ ├── contracts
│ │ ├── mocks
│ │ │ └── FCA
│ │ │ ├── getAccommodation
│ │ │ └── getRooms
│ │ ├── resolvers
│ │ ├── services
│ │ ├── types
│ │ │ └── usl
│ │ └── utils
│ │ ├── converters
│ │ │ ├── request
│ │ │ └── response
│ │ └── errors
│ ├── test
│ │ ├── **fixtures**
│ │ ├── **mocks**
│ │ ├── clients
│ │ ├── constants
│ │ ├── resolvers
│ │ ├── services
│ │ └── utils
│ │ ├── converters
│ │ │ ├── request
│ │ │ └── response
│ │ └── errors
│ └── test-pact
│ ├── matchers
│ ├── request
│ │ └── listOffersProxyService
│ ├── scenario
│ ├── tests
│ │ └── listOffers
│ │ ├── filters
│ │ └── holidays
│ ├── types
│ │ ├── constraints
│ │ └── matcher
│ └── utils
├── common
│ ├── constants
│ ├── models
│ │ └── interfaces
│ ├── types
│ └── utils
├── customMixins
├── infrastructure
└── ui
├── src
│ ├── components
│ │ ├── Alert
│ │ ├── AltDates
│ │ ├── Badge
│ │ ├── Checkbox
│ │ ├── Container
│ │ ├── Dialog
│ │ ├── DiscountLabel
│ │ ├── ErrorBoundary
│ │ ├── ErrorContainer
│ │ ├── Filters
│ │ │ ├── API
│ │ │ │ └── fragments
│ │ │ ├── CheckboxFilter
│ │ │ ├── DatesAndDurationFilter
│ │ │ ├── FilterCheckbox
│ │ │ ├── FilterGroup
│ │ │ ├── FiltersList
│ │ │ ├── FiltersPanel
│ │ │ ├── FlightsFilter
│ │ │ ├── FreeChildPlacesFilter
│ │ │ ├── HolidayTypeFilter
│ │ │ ├── Modal
│ │ │ ├── PriceFilter
│ │ │ ├── RatingFilters
│ │ │ ├── SelectedFilters
│ │ │ ├── Skeleton
│ │ │ └── utils
│ │ ├── FlightsDialog
│ │ ├── FreeChildPlacesLabel
│ │ ├── GalleryDialog
│ │ ├── GreatDealLabel
│ │ ├── Map
│ │ ├── Placeholder
│ │ ├── ProductCard
│ │ │ ├── Deposit
│ │ │ ├── GeneralInfo
│ │ │ │ ├── CustomerRating
│ │ │ │ ├── Rating
│ │ │ │ └── TripAdvisor
│ │ │ ├── HandLuggage
│ │ │ ├── ItemTUIBlue
│ │ │ ├── Price
│ │ │ ├── Slider
│ │ │ ├── Summary
│ │ │ └── TripDetails
│ │ ├── ProductWrapper
│ │ ├── RadioButton
│ │ ├── Rating
│ │ │ ├── CustomerRating
│ │ │ ├── TRating
│ │ │ └── TripAdvisorRating
│ │ ├── ResponsiveImage
│ │ ├── Select
│ │ ├── Shortlist
│ │ ├── ShowMoreLess
│ │ ├── Skeleton
│ │ ├── Sorting
│ │ ├── Tags
│ │ ├── TextBlock
│ │ └── Tooltip
│ ├── config
│ ├── constants
│ ├── contexts
│ │ ├── global
│ │ └── media
│ ├── events
│ ├── helpers
│ ├── hooks
│ ├── locales
│ │ ├── da-DK
│ │ ├── en-GB
│ │ ├── en-IE
│ │ ├── fi-FI
│ │ ├── fr-BE
│ │ ├── nb-NO
│ │ ├── nl-BE
│ │ ├── nl-NL
│ │ └── sv-SE
│ ├── mocks
│ │ └── data
│ ├── openmfe
│ ├── services
│ ├── signals
│ ├── staticTranslations
│ │ ├── be
│ │ ├── dk
│ │ ├── en
│ │ ├── fi
│ │ ├── ie
│ │ ├── nl
│ │ ├── no
│ │ └── se
│ ├── styles
│ │ └── components
│ │ ├── badge
│ │ ├── calendar
│ │ ├── carousel
│ │ ├── dialog
│ │ ├── error-container
│ │ ├── filters
│ │ │ ├── accessibility-filter
│ │ │ ├── airline-filters
│ │ │ ├── dates-and-duration
│ │ │ ├── filter-free-child-place
│ │ │ ├── filter-grid
│ │ │ ├── filter-group
│ │ │ ├── filter-pill
│ │ │ ├── filters-list-skeleton
│ │ │ ├── filters-panel
│ │ │ ├── filters-rating
│ │ │ ├── flights-filter
│ │ │ ├── modal
│ │ │ │ └── modal-container
│ │ │ ├── price-filter
│ │ │ └── selected-filters
│ │ ├── flights-dialog
│ │ ├── gallery-dialog
│ │ ├── product-card
│ │ │ ├── deposit
│ │ │ ├── free-child-places
│ │ │ ├── general-info
│ │ │ │ ├── customer-rating
│ │ │ │ ├── rating
│ │ │ │ └── trip-advisor
│ │ │ ├── hand-luggage
│ │ │ ├── item-tui-blue
│ │ │ ├── panel-tui-blue
│ │ │ ├── price
│ │ │ ├── skeleton
│ │ │ ├── slider
│ │ │ ├── summary
│ │ │ └── trip-details
│ │ ├── product-wrapper
│ │ ├── radio-button
│ │ ├── rating
│ │ ├── responsive-image
│ │ ├── select
│ │ ├── show-more-less
│ │ ├── skeleton
│ │ ├── small-product-card
│ │ ├── sorting
│ │ ├── subfilter
│ │ ├── tags
│ │ └── tooltip
│ ├── types
│ └── utils
├── template
│ └── test
├── test
│ ├── components
│ │ ├── Alert
│ │ ├── AltDates
│ │ ├── Badge
│ │ ├── Dialog
│ │ ├── DiscountLabel
│ │ ├── ErrorContainer
│ │ ├── Filters
│ │ │ ├── API
│ │ │ ├── DatesAndDurationFilter
│ │ │ ├── FilterCheckbox
│ │ │ ├── FiltersList
│ │ │ ├── FiltersPanel
│ │ │ ├── FlightsFilter
│ │ │ ├── FreeChildPlacesFilter
│ │ │ ├── HolidayTypeFilter
│ │ │ ├── PriceFilter
│ │ │ ├── RatingFilters
│ │ │ ├── SelectedFilters
│ │ │ ├── Skeleton
│ │ │ ├── SubfilterCheckbox
│ │ │ └── utils
│ │ ├── FlightsDialog
│ │ ├── FreeChildPlacesLabel
│ │ ├── GalleryDialog
│ │ ├── GreatDealLabel
│ │ ├── Map
│ │ ├── ProductCard
│ │ │ ├── Deposit
│ │ │ ├── GeneralInfo
│ │ │ ├── HandLuggage
│ │ │ ├── ItemTUIBlue
│ │ │ ├── Price
│ │ │ ├── Slider
│ │ │ └── Summary
│ │ ├── ProductWrapper
│ │ ├── Sorting
│ │ ├── staticTranslations
│ │ └── Tags
│ ├── constants
│ ├── events
│ ├── helpers
│ ├── hooks
│ ├── mocks
│ ├── services
│ ├── staticTranslations
│ └── utils
└── test-e2e
├── config
├── pages
│ └── components
├── playwright
│ └── mock
├── testData
│ ├── da
│ ├── en
│ ├── fi
│ ├── fr_BE
│ ├── ie
│ ├── nl
│ ├── nl_BE
│ ├── no
│ └── se
├── tests
│ ├── Filters
│ │ ├── Accessibility
│ │ ├── Airlines
│ │ ├── BoardBasis
│ │ ├── DatesAndDurations
│ │ ├── DepartureAirport
│ │ ├── Destination
│ │ ├── Facilities
│ │ ├── FreeChildPlace
│ │ ├── HolidayType
│ │ ├── Price
│ │ ├── Ratings
│ │ └── SortBy
│ ├── fixtures
│ ├── mocks
│ ├── product-card
│ ├── StickyPanel
│ └── unitDetailsPageTests
└── utils
