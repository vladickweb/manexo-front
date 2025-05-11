import { useUser } from "@/stores/useUser";

export const ProfilePage = () => {
  const { user: profile, logout } = useUser();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {profile?.firstName?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
