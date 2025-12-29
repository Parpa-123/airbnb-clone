from bookings.models import Bookings, Payment

# Delete all payments first (foreign key constraint)
payment_count = Payment.objects.count()
Payment.objects.all().delete()
print(f"✅ Deleted {payment_count} payments")

# Delete all bookings
booking_count = Bookings.objects.count()
Bookings.objects.all().delete()
print(f"✅ Deleted {booking_count} bookings")

print(f"\n📊 Remaining:")
print(f"   Bookings: {Bookings.objects.count()}")
print(f"   Payments: {Payment.objects.count()}")
