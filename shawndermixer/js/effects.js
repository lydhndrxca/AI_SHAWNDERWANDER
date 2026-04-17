// ─── Effects Registry ───

const EffectsRegistry = {
  _registry: {},

  register(type, EffectClass) {
    this._registry[type] = EffectClass;
  },

  create(type) {
    const Cls = this._registry[type];
    if (!Cls) throw new Error(`Unknown effect: ${type}`);
    const fx = new Cls(Engine.ctx);
    fx.type = type;
    return fx;
  },

  getTypes() {
    return Object.keys(this._registry);
  },

  getLabel(type) {
    const Cls = this._registry[type];
    return Cls ? (Cls.LABEL || type) : type;
  },
};
