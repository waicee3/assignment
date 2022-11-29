const  middleware  ={
    render: (view)=>{
        return (req, res, next)=>{
            res.render(view);
        }
    },

    globalLocals: (req,res,next)=>{
        global.req = req;
        next();
    },

    flashMessage:(req,res,next)=>{
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        res.locals.warning = req.flash('warning');
        req.next();
    }
}

module.exports = middleware;