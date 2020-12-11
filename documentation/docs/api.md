# Webserver REST API

# Generic Explanations

# Armour
route: */api/armours*
format: Map<number,
    {
        id: number,
        name: string,
        description: string,
        subtype: string,
        source_id: number,
        page: number,
        armour_class: number,
        carry_mod: number,
        tech_level: number,
        encumberance: number,
        cost: number
    }
>

# Backgrounds
route: */api/backgrounds*
format: Map<number,
    {
        id: number,
        name: string,
        description: string,
        short_description_start_index: number (experimental),
        free_skill_id: number,
        quick_skill_ids: number[],
        growth_skill_ids: number[],
        learning_skill_ids: number[],
        source_id: number,
        page: number,
    }
>

# Classes
route: */api/classes*
format: Map<number,
    {
        id: number,
        name: string,
        full_class_id: number,
        partial_class_id: number,
        description: string,
        source_id: number,
        page: number,
        system: boolean,
    }
>

# Class Descriptions
route: */api/class-descriptions*
format: Map<number,
    {
        id: number,
        name: string,
        description: string,
        source_id: number,
        page: number,
    }
>

# Cyberwares

# Equipment

# Foci

# Psychic Disciplines

# Psychic Powers

# Skills

# Stims