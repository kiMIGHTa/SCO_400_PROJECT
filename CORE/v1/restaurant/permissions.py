from rest_framework import permissions

class IsRestaurantOwner(permissions.BasePermission):
    """Allow access only to the restaurant owner."""

    def has_permission(self, request, view):
        return request.user.is_authenticated  # Ensure user is logged in

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user  # Check if user owns the restaurant


# class IsRestaurantStaff(permissions.BasePermission):
#     """Allow access to restaurant staff members only."""

#     def has_permission(self, request, view):
#         return request.user.is_authenticated  # Ensure user is logged in

#     def has_object_permission(self, request, view, obj):
#         return obj.staff.filter(id=request.user.id).exists()  # Check if user is in staff list
