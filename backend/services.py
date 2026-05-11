class EmissionCalculator:
    COEFFICIENTS = {
        'transport': {
            'car_km': 0.192,
            'bus_km': 0.089,
            'train_km': 0.041,
            'flight_h': 90.0,
        },
        'energy': {
            'electricity_kwh': 0.475,
            'natural_gas_m3': 2.0,
            'heating_oil_l': 2.52,
        },
        'food': {
            'beef_kg': 27.0,
            'chicken_kg': 6.9,
            'vegetables_kg': 2.0,
        },
    }

    @classmethod
    def calculate(cls, category: str, source: str, amount: float) -> float:
        coefficient = cls.COEFFICIENTS.get(category, {}).get(source)
        if coefficient is None:
            raise ValueError(f'Unsupported category/source: {category}/{source}')
        return round(amount * coefficient, 4)

    @classmethod
    def supported_sources(cls):
        return cls.COEFFICIENTS
