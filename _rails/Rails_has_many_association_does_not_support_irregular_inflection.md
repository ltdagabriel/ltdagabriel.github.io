---
title: Rails has_many association does not support irregular inflection
labels: activesupport
layout: issue
---

NameError in History/hist_paquets_mesures#show
Showing /var/www-opf/opf/app/views/history/hist_paquets_mesures/show.html.haml where line #19 raised: 
**uninitialized constant HistPaquetMesures::HistVersionsPaquetsMesure**

The part of my (HAML) view causing this issue :

```
= debug @hist_paquet_mesures.hist_versions_paquets_mesures
```

I set up an exception for the special singular-plural names that I use in **config/initializers/inflections.rb** :

```
  ActiveSupport::Inflector.inflections do |inflect|
    inflect.irregular 'pub_liste_horizon', 'pub_listes_horizon'
    inflect.irregular 'hist_paquet_mesures', 'hist_paquets_mesures'
    inflect.irregular 'hist_projet_connexe', 'hist_projets_connexes'
    inflect.irregular 'hist_version_paquet_mesures', 'hist_versions_paquets_mesures'
    inflect.irregular 'hist_origine_modification', 'hist_origines_modification'
  end
```

**Pluralize** , **singularize** and **classify** methods are working as expected on rails console :

```
"hist_versions_paquets_mesures".singularize  => "hist_version_paquet_mesures"
"hist_versions_paquets_mesures".classify  => "HistVersionPaquetMesures"
"hist_version_paquet_mesures".pluralize  => "hist_versions_paquets_mesures"
```

My **app/model/hist_paquet_mesures.rb** model :

```
class HistPaquetMesures < ActiveRecord::Base
  belongs_to :pub_indice
  belongs_to :pub_liste_horizon
  belongs_to :admin_utilisateur
  has_many :hist_versions_paquets_mesures
end
```

My **app/model/hist_version_paquet_mesures.rb** model :

```
class HistVersionPaquetMesures < ActiveRecord::Base
  belongs_to :hist_paquet_mesures
  belongs_to :pub_modification
  belongs_to :vers_origine, :class_name => 'HistOrigineModification', :foreign_key => 'hist_origine_modification_id'
  # polymorphic association
  has_one :comme_origine, :class_name => 'HistOrigineModification', as: :hist_origine
end
```

My **app/controllers/history/hist_paquets_mesures_controller.rb** controller :

```
class History::HistPaquetsMesuresController < ApplicationController
  def show
    @hist_paquet_mesures = HistPaquetMesures.find_by_id(params[:id])
    respond_with(:history, @hist_paquet_mesures)
  end
end
```

The weird thing is where the "s" go in "HistVersionsPaquetsMesure" of the error message : **HistPaquetMesures::HistVersionsPaquetsMesure**

Other weird things is that the association is working in the opposite direction (belongs_to) (i.e. : my_hist_version_paquet_mesures.hist_paquet_mesures)

Shouldn't it be HistPaquetMesures::HistVersionPaquetMesures ?
Why do I have this result ?

