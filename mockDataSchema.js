var schema = {
  "type": "object",
  "properties": {
    "members": {
      "type": "object",
      "properties": {
        "members": {
          "type": "array",
          "minItems": 150,
          "maxItems": 950,
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "minimum": 1,
                "autoIncrement": true
              },
              "voornaam": {
                "type": "string",
                "faker": "name.firstName"
              },
              "achternaam": {
                "type": "string",
                "faker": "name.firstName"
              },
              "initialen": {
                "type": "string"
              },
              "tussenvoegsel": {
                "type": "string"
              },
              "geboortedatum": {
                "type": "string",
                "chance": {
                  "birthday": {
                    "string": true
                  }
                }
              },
              "prominent": {
                "type": "integer"
              },
              "kleur": {
                "type": "string",
                "faker": "internet.color"
              },
              "afbeelding": {
                "type": "string",
                "faker": { "image.imageUrl": [300, 300, undefined, true, true] }
              },
              "bijnaam": {
                "type": "string",
                "faker": "name.firstName"
              },
              "button_width": {
                "enum": [null, null, null, null, null, null, null, null, null, 100, 150]
              },
              "button_height": {
                "enum": [null, null, null, null, null, null, null, null, null, 100, 150]
              }
            },
            "required": ["id", "voornaam", "achternaam", "geboortedatum", "prominent", "kleur", "afbeelding", "bijnaam", "button_width", "button_height"]
          }
        }
      },
      "required": ["members"]
    },
    "products": {
      "type": "object",
      "required": ["products"],
      "properties": {
        "products": {
          "type": "array",
          "minItems": 20,
          "maxItems": 30,
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "minimum": 1,
                "autoIncrement": true
              },
              "naam": {
                "type": "string",
                "faker": "commerce.productName"
              },
              "prijs": {
                "type": "number",
                "minimum": 0.01,
                "maximum": 3.00
              },
              "categorie": {
                "enum": ["Bier", "Fris", "Eten"]
              },
              "positie": {
                "type": "integer",
                "minimum": 1,
                "maximum": 999
              },
              "afbeelding": {
                "type": "string",
                "faker": { "image.imageUrl": [300, 300, undefined, true, true] }
              },
              "kleur": {
                "type": "string",
                "faker": "internet.color"
              },
              "splash_afbeelding": {
                "type": "string",
                "faker": { "image.imageUrl": [300, 300, undefined, true, true] }
              }
            },
            "required": ["id", "naam", "prijs", "categorie", "positie", "afbeelding", "kleur", "splash_afbeelding"]
          }
        }
      }
    },
    "boards": {
      "type": "object",
      "required": ["boardMembers"],
      "properties": {
        "type": "object",
        "boardMembers": {
          "type": "array",
          "minItems": 30,
          "maxItems": 40,
          "items": {
            "type": "object",
            "properties": {
              "lid_id": {
                "type": "integer",
                "minimum": 1,
                "maximum": 1000
              },
              "jaar": {
                "type": "integer",
                "minimum": 2000,
                "maximum": 2018
              },
              "functie": {
                "enum": ["Voorzitter", "Secretaris", "Penningmeester", "Intern", "Bedrijvencommissaris"]
              }
            },
            "required": ["lid_id", "jaar", "functie"]
          }
        }
      }
    },
    "committees": {
      "type": "object",
      "required": ["committees"],
      "properties": {
        "type": "object",
        "committees": {
          "type": "array",
          "minItems": 20,
          "maxItems": 200,
          "items": {
            "type": "object",
            "properties": {
              "commissie_id": {
                "type": "integer",
                "minimum": 1,
                "maximum": 20
              },
              "lid_id": {
                "type": "integer",
                "minimum": 1,
                "maximum": 1000
              },
              "jaar": {
                "type": "integer",
                "minimum": 2017,
                "maximum": 2017
              },
              "functie": {
                "enum": ["", "Voorzitter", "Secretaris", "Penningmeester", "Intern", "Bedrijvencommissaris"]
              },
              "naam": {
                "enum": ["Bestuur", "Alumnicie", "Borrelcie", "Brouwcie", "Buixie", "Compucie", "Fotocie", "Fraccie", "s[ck]rip(t|t?c)ie", "Francken Vrij", "Kascie", "Oefensescie", "Representacie", "Sjaarscie", "Sympcie", "Sportcie", "Takcie", "Wiecksie", "Intercie", "CoDcie"]
              }
            },
            "required": ["commissie_id", "lid_id", "jaar", "naam", "functie"]
          }
        }
      }
    },
    "orders": {
      "type": "array"
    }
  },
  "required": [
    "members", "products", "committees", "boards", "orders"
  ]
};

module.exports = schema;
