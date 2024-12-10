import { StreamingAvailability } from '../types/streaming';

interface StreamingOptionsProps {
  availability: StreamingAvailability;
}

export function StreamingOptions({ availability }: StreamingOptionsProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Disponible en streaming sur :</h2>

      {/* Abonnement */}
      {availability.subscription.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Abonnement</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availability.subscription.map((service) => (
              <a
                key={service.id}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <img
                  src={service.logo}
                  alt={service.name}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                />
                <span className="text-white">{service.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      {availability.rental.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Location</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availability.rental.map(({ service, price }) => (
              <a
                key={service.id}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <img
                  src={service.logo}
                  alt={service.name}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                />
                <div>
                  <span className="text-white block">{service.name}</span>
                  <span className="text-blue-400">{price.toFixed(2)} €</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Achat */}
      {availability.purchase.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Achat</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availability.purchase.map(({ service, price }) => (
              <a
                key={service.id}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <img
                  src={service.logo}
                  alt={service.name}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                />
                <div>
                  <span className="text-white block">{service.name}</span>
                  <span className="text-blue-400">{price.toFixed(2)} €</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}