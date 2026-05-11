from app import app, db
from models import EmissionFactor


def seed_data():
    with app.app_context():
        if EmissionFactor.query.first() is None:
            emission_factors = [
                EmissionFactor(
                    activity_category='Enerji',
                    source='Elektrik',
                    factor_value=0.44,
                    unit='kg CO2e/kWh',
                ),
                EmissionFactor(
                    activity_category='Enerji',
                    source='Doğalgaz',
                    factor_value=2.02,
                    unit='kg CO2e/m3',
                ),
                EmissionFactor(
                    activity_category='Ulaşım',
                    source='Benzinli Araç',
                    factor_value=2.31,
                    unit='kg CO2e/Litre',
                ),
                EmissionFactor(
                    activity_category='Ulaşım',
                    source='Dizel Araç',
                    factor_value=2.68,
                    unit='kg CO2e/Litre',
                ),
            ]
            db.session.add_all(emission_factors)
            db.session.commit()
            
if __name__ == "__main__":
    seed_data()
    print("VERİLER BAŞARIYLA EKLENDİ!")
