.PHONY: help install dev build preview clean lint lint-fix format format-check test test-ui images images-watch lighthouse

# Default target
help:
	@echo "Black Hole Consulting - Commandes disponibles"
	@echo ""
	@echo "  make install        Installer les dépendances"
	@echo "  make dev            Lancer le serveur de développement (localhost:4321)"
	@echo "  make build          Construire le site pour la production"
	@echo "  make preview        Prévisualiser le build de production"
	@echo "  make clean          Nettoyer les fichiers générés"
	@echo ""
	@echo "  make lint           Vérifier le code avec ESLint"
	@echo "  make lint-fix       Corriger automatiquement les erreurs ESLint"
	@echo "  make format         Formater le code avec Prettier"
	@echo "  make format-check   Vérifier le formatage"
	@echo ""
	@echo "  make test           Lancer les tests Playwright"
	@echo "  make test-ui        Lancer les tests avec interface graphique"
	@echo "  make lighthouse     Lancer l'audit Lighthouse"
	@echo ""
	@echo "  make images         Traiter les images du projet"
	@echo "  make images-watch   Surveiller et traiter les images automatiquement"

# Installation des dépendances
install:
	npm install

# Développement
dev:
	npm run dev

# Build production
build:
	npm run build

# Preview du build
preview: build
	npm run preview

# Nettoyage
clean:
	rm -rf dist node_modules/.cache .astro

# Linting
lint:
	npm run lint

lint-fix:
	npm run lint:fix

# Formatage
format:
	npm run format

format-check:
	npm run format:check

# Tests
test:
	npm run test

test-ui:
	npm run test:ui

# Lighthouse
lighthouse:
	npm run lighthouse

# Images
images:
	npm run images:process

images-watch:
	npm run images:watch

# Raccourci pour tout préparer et lancer
start: install dev

# Build complet avec vérifications
release: lint format-check build
