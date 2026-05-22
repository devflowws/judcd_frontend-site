# 🚀 Guide d'Intégration Django REST Framework + React

## Configuration Actuelle ✅

| Composant | Configuration |
|-----------|---------------|
| **Backend** | Django REST Framework |
| **Authentification** | JWT (Token + Refresh) |
| **API URL** | `http://localhost:8000/api/v1` |
| **Variable d'env** | `VITE_API_URL` |

---

## Services Disponibles 📦

### 1️⃣ **Authentification** (`authService.js`)

```javascript
import { login, logout, refreshAccessToken, checkAuth } from '@services/authService';

// Connexion
const result = await login('email@example.com', 'password');
if (result.success) {
  console.log('Utilisateur:', result.data);
}

// Vérifier si connecté
if (checkAuth()) {
  console.log('Utilisateur authentifié');
}

// Déconnexion
await logout();

// Rafraîchir le token (auto-géré, mais disponible)
await refreshAccessToken();
```

---

### 2️⃣ **Actions** (`actionService.js`)

```javascript
import * as actionService from '@services/actionService';

// Lister les actions
const { success, data } = await actionService.getActions({ page: 1 });
const actions = data;

// Créer une action
await actionService.createAction({
  title: 'Action solidaire',
  description: 'Description...',
  date: '2024-05-15',
  // ... autres champs
});

// Récupérer une action
await actionService.getActionById(1);

// Mettre à jour (PUT - tous les champs)
await actionService.updateAction(1, { title: 'Nouveau titre', ... });

// Mise à jour partielle (PATCH - champs sélectionnés)
await actionService.partialUpdateAction(1, { title: 'Nouveau titre' });

// Supprimer
await actionService.deleteAction(1);
```

---

### 3️⃣ **Dons/Donations** (`donService.js`)

```javascript
import * as donService from '@services/donService';

// Même structure que les actions
const dons = await donService.getDons();
await donService.createDon({ montant: 10000, ... });
await donService.getDonById(1);
await donService.updateDon(1, { montant: 15000 });
await donService.deleteDon(1);
```

---

### 4️⃣ **Galerie Actions** (`galerieService.js`)

```javascript
import * as galerieService from '@services/galerieService';

const galeries = await galerieService.getGaleries();
await galerieService.createGalerie({ titre: '...', image: '...', ... });
// ... autres opérations CRUD
```

---

### 5️⃣ **Membres Équipe** (`membreService.js`)

```javascript
import * as membreService from '@services/membreService';

const membres = await membreService.getMembres();
await membreService.createMembre({ nom: '...', ... });
// ... autres opérations CRUD
```

---

### 6️⃣ **Partenaires** (`partenairesService.js`)

```javascript
import * as partenairesService from '@services/partenairesService';

const partenaires = await partenairesService.getPartenaires();
await partenairesService.createPartenaire({ nom: '...', ... });
// ... autres opérations CRUD
```

---

### 7️⃣ **Témoignages** (`temoignageService.js`)

```javascript
import * as temoignageService from '@services/temoignageService';

const temoignages = await temoignageService.getTemoignages();
await temoignageService.createTemoignage({ auteur: '...', texte: '...', ... });
// ... autres opérations CRUD
```

---

### 8️⃣ **Newsletter** (`newsletterService.js`)

```javascript
import * as newsletterService from '@services/newsletterService';

const newsletters = await newsletterService.getNewsletters();
await newsletterService.createNewsletter({ titre: '...', contenu: '...', ... });
// ... autres opérations CRUD
```

---

### 9️⃣ **Contact** (`contactService.js`)

```javascript
import { sendMessage, getMessages, getMessageById } from '@services/contactService';

// Formulaire public de contact
await sendMessage({
  name: 'Jean',
  email: 'jean@example.com',
  phone: '+228 XXXXXX',
  subject: 'Demande de renseignements',
  message: 'Bonjour...',
});

// Admin: lister les messages
const messages = await getMessages({ page: 1 });

// Admin: récupérer un message
await getMessageById(1);

// Admin: marquer comme lu
await markMessageAsRead(1);
```

---

## Structure de Réponse Standard 📋

Toutes les fonctions retournent :

```javascript
{
  success: true | false,
  data: { ... },        // Présent si succès
  error: { detail: "..." }  // Présent si erreur
}
```

---

## Gestion des Erreurs 🚨

```javascript
const result = await actionService.getActions();

if (!result.success) {
  console.error('Erreur:', result.error);
  // Gestion de l'erreur...
} else {
  const actions = result.data;
  // Traitement des données...
}
```

---

## Intercepteurs Axios Activés 🔐

✅ **Injection JWT automatique** → Le token est ajouté à chaque requête  
✅ **Refresh token auto** → Si 401, rafraîchit le token automatiquement  
✅ **Gestion 403** → Permissions insuffisantes  
✅ **Gestion 404** → Ressource introuvable  
✅ **Gestion 500** → Erreur serveur  

---

## Exemple d'Utilisation Complet 💡

```javascript
// Dans un composant React
import { useEffect, useState } from 'react';
import * as actionService from '@services/actionService';

export function ActionsList() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadActions = async () => {
      try {
        const result = await actionService.getActions({ page: 1 });
        if (result.success) {
          setActions(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadActions();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.detail}</div>;

  return (
    <ul>
      {actions.map(action => (
        <li key={action.id}>{action.title}</li>
      ))}
    </ul>
  );
}
```

---

## Prochaines Étapes 🎯

1. **Vérifier les champs** de chaque modèle Django (quels champs peut-on envoyer ?)
2. **Tester la connexion** → `/admin/login` doit marcher
3. **Adapter les composants** existants pour utiliser les nouveaux services
4. **Ajouter les types/validations** (zod, yup, ou TypeScript)
5. **Configurer les variables d'env** pour prod

---

## Problèmes Courants ❌

### "401 Unauthorized"
→ Token expiré ou invalide. Vérifiez que votre backend accepte les tokens JWT.

### "422 Unprocessable Entity"
→ Les données envoyées ne matchent pas vos modèles Django. Vérifiez les champs requis.

### "CORS error"
→ Configurez CORS dans votre Django `settings.py` :

```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Votre frontend Vite
    "http://localhost:3000",
]
```

---

**✨ Vous êtes prêt à intégrer ! Bonne chance ! 🚀**
