import requests

# Az önce oluşturduğumuz kullanıcının ID'si 3 olduğu için sonuna 3 koyduk
BASE_URL = 'http://127.0.0.1:5000/api/emissions/summary/3'

def test_summary():
    print('=== Karbon Özet (Aylık) Testi Başlatılıyor ===')
    try:
        # Sunucuya "Bana aylık (monthly) özeti getir" diyoruz
        response = requests.get(f'{BASE_URL}?period=monthly')
        print(f'Durum Kodu: {response.status_code}')
        print(f'Yanıt: {response.json()}')
    except Exception as e:
        print(f'Hata oluştu: {e}')

if __name__ == '__main__':
    test_summary()