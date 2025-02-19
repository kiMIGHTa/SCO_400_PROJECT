from rest_framework.permissions import BasePermission

class IsRestaurantOwnerOrStaff(BasePermission):
    """
    Custom permission to allow only restaurant owners and their staff to manage food items.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated  # Ensure user is logged in

    def has_object_permission(self, request, view, obj):
        """Check if user is the restaurant owner or staff."""
        return (
            obj.restaurant.owner == request.user or
            obj.restaurant.staff.filter(id=request.user.id).exists()
        )
